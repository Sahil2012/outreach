import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import { Upload, FileText } from 'lucide-react';
import { Loader } from '../components/ui/loader';

export default function ProfileCreatePage() {
  const [phone, setPhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setResumeUrl('');
    }
  };

  const uploadResume = async () => {
    if (!resumeFile && !resumeUrl) {
      setError('Please upload a resume or provide a URL');
      return null;
    }

    if (resumeFile) {
      setUploading(true);
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${user!.id}-${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resumeFile);

      if (uploadError) {
        setError('Failed to upload resume: ' + uploadError.message);
        setUploading(false);
        return null;
      }

      const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
      setUploading(false);
      return data.publicUrl;
    }

    return resumeUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const finalResumeUrl = await uploadResume();
    if (!finalResumeUrl) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .maybeSingle();

    if (profile) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          phone,
          linkedin_url: linkedinUrl,
          resume_url: finalResumeUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user!.id);

      if (updateError) {
        setError('Failed to update profile: ' + updateError.message);
        return;
      }
    }

    setParsing(true);

    try {
      const response = await fetch('http://localhost:3000/extract-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeUrl: finalResumeUrl,
          userId: user!.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }

      const parsedData = await response.json();

      if (parsedData.skills?.length > 0) {
        await supabase.from('skills').insert(
          parsedData.skills.map((skill: string) => ({
            user_id: user!.id,
            skill_name: skill,
          }))
        );
      }

      if (parsedData.projects?.length > 0) {
        await supabase.from('projects').insert(
          parsedData.projects.map((project: any) => ({
            user_id: user!.id,
            title: project.title || 'Untitled Project',
            description: project.description,
            technologies: project.technologies || [],
          }))
        );
      }

      if (parsedData.education?.length > 0) {
        await supabase.from('education').insert(
          parsedData.education.map((edu: any) => ({
            user_id: user!.id,
            institution: edu.institution || 'Unknown',
            degree: edu.degree || 'Unknown',
            field_of_study: edu.field_of_study,
          }))
        );
      }

      navigate('/profile/edit');
    } catch (err) {
      setParsing(false);
      navigate('/profile/edit');
    }
  };

  if (parsing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader size="lg" text="Parsing your resume..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Your Profile</h1>
          <p className="text-slate-600">
            Upload your resume and we'll automatically extract your skills, projects, and education
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <TextField
              label="Phone Number (Optional)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
            />

            <TextField
              label="LinkedIn URL (Optional)"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Resume
              </label>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      {resumeFile ? (
                        <>
                          <FileText className="w-12 h-12 text-slate-600 mb-2" />
                          <p className="text-sm font-medium text-slate-700">{resumeFile.name}</p>
                          <p className="text-xs text-slate-500 mt-1">Click to change</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-slate-400 mb-2" />
                          <p className="text-sm font-medium text-slate-700">Click to upload resume</p>
                          <p className="text-xs text-slate-500 mt-1">PDF, DOC, or DOCX up to 10MB</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                <div className="text-center text-slate-500 text-sm">or</div>

                <TextField
                  label="Resume URL"
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => {
                    setResumeUrl(e.target.value);
                    setResumeFile(null);
                  }}
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={uploading || (!resumeFile && !resumeUrl)}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Continue'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
