import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Loader } from '../../../components/ui/loader';
import { Upload, ArrowRight } from 'lucide-react';

export default function BasicInfoPage() {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [resume, setResume] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoaded && user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            // Phone might be in user.primaryPhoneNumber if it exists, but for now we'll just use local state
        }
    }, [isLoaded, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Update Clerk User (Name)
            if (user) {
                await user.update({
                    firstName,
                    lastName,
                    // phone number update usually requires verification in Clerk, 
                    // so we might just save it to our backend profile or skip for now if not critical.
                    // For this flow, let's assume we just update the name.
                });

                // 2. Upload Resume & Save Phone (Backend)
                // const formData = new FormData();
                // formData.append('resume', resume);
                // formData.append('phone', phone);
                // await axios.post('/api/onboarding/basic', formData);

                // For now, just proceed to next step
                navigate('/onboarding/professional-info');
            }
        } catch (error) {
            console.error("Failed to update basic info", error);
        } finally {
            setLoading(false);
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

                        <div className="space-y-2">
                            <Label>Resume (Optional)</Label>
                            <div className="border-2 border-dashed border-border/60 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                                    accept=".pdf,.doc,.docx"
                                />
                                <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                                {resume ? (
                                    <p className="text-sm font-medium text-primary">{resume.name}</p>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                        <p className="text-xs text-muted-foreground mt-1">PDF, DOC up to 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <Button type="submit" className="w-full rounded-full" disabled={loading}>
                            {loading ? <Loader className="w-4 h-4 mr-2" /> : null}
                            Next Step
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
