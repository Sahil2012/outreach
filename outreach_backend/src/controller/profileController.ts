import { Request, Response } from 'express';
import { supabase } from '../apis/supabaseClient.js';
import { Queue } from 'bullmq';
import { redisConnection } from '../utils/redis.js';


const resumeQueue = new Queue('resume-processing', { connection: redisConnection });


// GET /profile/me
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /profile/update
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const { data, error } = await supabase
      .from('User')
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) throw error;
    res.json({ message: 'Profile updated', data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


// POST /profile/upload/resume

export const uploadResume = async (req : Request, res : Response) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    const autofill = req.body.autofill === 'true';

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(`user_${userId}/${file.originalname}`, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const resumeUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/resumes/${uploadData.path}`;

    await supabase.from('User').update({ resumeUrl }).eq('id', userId);

    // Enqueue for background processing
    if (autofill) {
      await resumeQueue.add('process', { userId, resumeUrl });
    }

    res.json({
      message: autofill
        ? 'Resume uploaded and sent for parsing'
        : 'Resume uploaded successfully',
      resumeUrl,
    });
  } catch (err : any) {
    res.status(500).json({ error: err.message });
  }
};
// export const uploadResume = async (req: Request, res: Response) => {
//   try {

//     const userId = req.user.id;
//     const file = req.file;
//     const autofill = req.body.autofill === 'true';

//     if (!file) return res.status(400).json({ error: 'No file uploaded' });

//     const { data: uploadData, error: uploadError } = await supabase.storage
//       .from('resumes')
//       .upload(`user_${userId}/${file.originalname}`, file.buffer, {
//         contentType: file.mimetype,
//         upsert: true,
//       });

//     if (uploadError) throw uploadError;

//     let resumeUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/resumes/${uploadData.path}`;

//     await supabase.from('User').update({ resumeUrl }).eq('id', userId);

//     // Optional: parse resume
//     if (autofill) {
//       res.json({ message: 'Resume uploaded and parsed', resumeUrl });
//     } else {
//       res.json({ message: 'Resume uploaded successfully', resumeUrl });
//     }
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// };
