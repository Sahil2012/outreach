import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/ui/loader';
import { ArrowRight } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { ResumeUpload } from './ResumeUpload';
import { toast } from 'sonner';
import { useResume } from '@/hooks/useResume';

export default function BasicInfoPage() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { updateProfile, isUpdating } = useProfile();
  const { uploadResume, isLoading } = useResume();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState<File | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [isLoaded, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) {
        throw new Error('User not found');
      }

      if (resume) {
        await uploadResume(resume);
      }
      await updateProfile({
        firstName,
        lastName,
      });
      navigate('/onboarding/professional-info');
    } catch (error) {
      console.error("Failed to update basic info", error);
      toast.error("Some error occurred. Please try again later");
    }
  };

  if (!isLoaded) {
    return <div className="flex justify-center p-8"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Outreach</h1>
        <p className="text-muted-foreground">Let's get you set up. First, tell us a bit about yourself.</p>
      </div>

      <Card>
        <CardContent className='py-6'>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.primaryEmailAddress?.emailAddress || ''}
                disabled
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                type="tel"
              />
            </div>

            <ResumeUpload
              onUpload={(file) => setResume(file)}
              onRemove={() => setResume(null)}
              initialResume={resume}
            />

            <Button type="submit" className="w-full rounded-full" disabled={isLoading || isUpdating}>
              {isLoading || isUpdating ? <Loader className="w-4 h-4 mr-2" /> : null}
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
