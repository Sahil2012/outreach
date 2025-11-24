import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Upload, FileText } from 'lucide-react';
import { Loader } from '../../../components/ui/loader';
import axios from 'axios';

export default function ProfileCreatePage() {
  const [phone, setPhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setResumeUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      const token = await getToken();
      
      // Update profile details first
      if (phone || linkedinUrl) {
        await axios.put(
          'http://localhost:3000/profile/update',
          { phone, linkedin_url: linkedinUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Upload resume if selected
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('autofill', 'true');

        await axios.post(
          'http://localhost:3000/profile/upload/resume',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else if (resumeUrl) {
        // Handle resume URL if backend supports it, or just update profile with URL
        await axios.put(
          'http://localhost:3000/profile/update',
          { resume_url: resumeUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to update profile');
      setUploading(false);
    }
  };

  if (uploading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader size="lg" text="Setting up your profile..." />
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

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <Label className="mb-2 block">Resume</Label>

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

                  <div className="space-y-2">
                    <Label htmlFor="resumeUrl">Resume URL</Label>
                    <Input
                      id="resumeUrl"
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
              </div>

              <Button
                type="submit"
                disabled={uploading || (!resumeFile && !resumeUrl)}
                className="w-full"
              >
                {uploading ? 'Uploading...' : 'Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
