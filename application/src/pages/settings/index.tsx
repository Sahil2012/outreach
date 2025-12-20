import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Loader } from '../../components/ui/loader';
import {
    Lock,
    AlertCircle,
    CheckCircle,
    CreditCard,
    Save
} from 'lucide-react';
import { Label } from '../../components/ui/label';

export default function SettingsPage() {
    const { user, isLoaded: isUserLoaded } = useUser();

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    const handlePasswordSubmit = async () => {
        setPasswordError('');
        setPasswordSuccess('');
        setIsPasswordLoading(true);

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords don't match");
            setIsPasswordLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            setIsPasswordLoading(false);
            return;
        }

        try {
            if (user?.passwordEnabled) {
                // Change Password
                await user.updatePassword({
                    currentPassword,
                    newPassword,
                });
                setPasswordSuccess("Password updated successfully");
            } else {
                // Set Password
                await user?.updatePassword({
                    newPassword,
                });
                setPasswordSuccess("Password set successfully");
            }
            // Clear fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            console.error("Password update error:", err);
            setPasswordError(err.errors?.[0]?.longMessage || "Failed to update password");
        } finally {
            setIsPasswordLoading(false);
        }
    };

    if (!isUserLoaded) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <Loader size="lg" text="Loading settings..." />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account security and billing preferences</p>
            </div>

            <div className="grid gap-8">
                {/* Security */}
                <Card>
                    <CardHeader className="border-b border-border/40 px-6 py-6">
                        <div className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-primary" />
                            <CardTitle>Security</CardTitle>
                        </div>
                        <CardDescription>
                            {user?.passwordEnabled
                                ? "Change your password"
                                : "Set a password for your account"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {passwordError && (
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {passwordError}
                            </div>
                        )}
                        {passwordSuccess && (
                            <div className="bg-green-500/10 text-green-600 text-sm p-3 rounded-lg flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                {passwordSuccess}
                            </div>
                        )}

                        <div className="space-y-4 max-w-md">
                            {user?.passwordEnabled && (
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <Button
                                onClick={handlePasswordSubmit}
                                disabled={isPasswordLoading}
                                className="w-full sm:w-auto rounded-full shadow-lg shadow-primary/20"
                            >
                                {isPasswordLoading ? (
                                    <Loader className="w-4 h-4 mr-2" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                {user?.passwordEnabled ? "Update Password" : "Set Password"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Billing Information */}
                <Card>
                    <CardHeader className="border-b border-border/40 px-6 py-6">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <CardTitle>Billing Information</CardTitle>
                        </div>
                        <CardDescription>Manage your subscription and payment methods</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="bg-muted/30 rounded-xl p-6 border border-border/40">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">Free Plan</h3>
                                    <p className="text-sm text-muted-foreground">You are currently on the free plan</p>
                                </div>
                                <Button variant="outline" className="rounded-full">Upgrade Plan</Button>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Next billing date</span>
                                    <span className="font-medium">N/A</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment method</span>
                                    <span className="font-medium">No payment method added</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
