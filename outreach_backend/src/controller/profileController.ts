import { Request, Response } from 'express';
import { supabase } from '../apis/supabaseClient.js';
import { ResumeParser } from '../utils/ResumeParser.js';

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
export const uploadResume = async (req: Request, res: Response) => {
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

    let resumeUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/resumes/${uploadData.path}`;

    await supabase.from('User').update({ resumeUrl }).eq('id', userId);

    if (autofill) {
      const parser = new ResumeParser();
      const parsedData = await parser.parseResume(file.path);
      res.json({ message: 'Resume uploaded and parsed', resumeUrl, parsedData });
    } else {
      res.json({ message: 'Resume uploaded successfully', resumeUrl });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
