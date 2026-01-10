import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader } from "../../components/ui/loader";
import {
  Lock,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Save,
  Coins,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { toast } from "sonner";
import { useProfile } from "../../hooks/useProfile";
import { useRechargeCredits } from "../../hooks/useRechargeCredits";

export default function SettingsPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { rechargeCredits, isRecharging } = useRechargeCredits();

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Recharge State
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  // Credit packages (amount in dollars)
  const creditPackages = [
    { id: 1, amount: 5, credits: 100, label: "Starter", popular: false },
    { id: 2, amount: 10, credits: 200, label: "Popular", popular: true },
    { id: 3, amount: 20, credits: 400, label: "Pro", popular: false },
  ];

  const handlePasswordSubmit = async () => {
    setPasswordError("");
    setPasswordSuccess("");
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
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Password update error:", err);
      setPasswordError(
        err.errors?.[0]?.longMessage || "Failed to update password"
      );
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleRecharge = async () => {
    const amount = selectedPackage
      ? creditPackages.find((pkg) => pkg.id === selectedPackage)?.amount
      : parseFloat(customAmount);

    if (!amount || amount <= 0) {
      toast.error("Please select a package or enter a valid amount");
      return;
    }

    try {
      await rechargeCredits(amount);
      toast.success(`Successfully recharged ${amount * 20} credits!`);
      setIsRechargeDialogOpen(false);
      setSelectedPackage(null);
      setCustomAmount("");
    } catch (error: any) {
      console.error("Recharge error:", error);
      toast.error(error?.response?.data?.error || "Failed to recharge credits");
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account security and billing preferences
        </p>
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

            <div className="space-y-6 max-w-md">
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
            <CardDescription>
              Manage your credits and recharge options
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Credits Display */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
              <div className="flex items-start justify-between">
                <div className="">
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="w-5 h-5 text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Credits Available
                    </p>
                  </div>
                  {isProfileLoading ? (
                    <Loader size="sm" />
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <h2 className="text-4xl font-bold text-foreground">
                        {profile?.credits ?? 0}
                      </h2>
                      {/* <span className="text-sm text-muted-foreground">
                        credits
                      </span> */}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    1 credit per email generation
                  </p>
                </div>
                <Button
                  onClick={() => {
                    toast.info("We are sorry. Currently, adding extra credits is not supported. Please contact support for assistance.")
                    // setIsRechargeDialogOpen(true);
                  }}
                  className="rounded-full shadow-lg shadow-primary/20"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Recharge Credits
                </Button>
              </div>

              {/* Low Credit Warning */}
              {!isProfileLoading && (profile?.credits ?? 0) < 5 && (
                <div className="mt-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-sm p-3 rounded-lg flex items-center gap-2 border border-yellow-500/20">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Your credit balance is low. Recharge now to continue sending
                    emails.
                  </span>
                </div>
              )}
            </div>

            {/* Plan Information */}
            <div className="bg-muted/30 rounded-xl p-6 border border-border/40">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">Pay As You Go</h3>
                  <p className="text-sm text-muted-foreground">
                    Recharge credits as needed
                  </p>
                </div>
              </div>
              {/* <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credit Rate</span>
                  <span className="font-medium">$0.05 per credit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment method</span>
                  <span className="font-medium">Credit Card</span>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Recharge Dialog */}
        <Dialog
          open={isRechargeDialogOpen}
          onOpenChange={setIsRechargeDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Recharge Credits</DialogTitle>
              <DialogDescription>
                Select a package or enter a custom amount to recharge your
                credits
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Credit Packages */}
              <div className="space-y-3">
                <Label>Select Package</Label>
                <div className="grid grid-cols-3 gap-3">
                  {creditPackages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackage(pkg.id);
                        setCustomAmount("");
                      }}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        selectedPackage === pkg.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                          Popular
                        </div>
                      )}
                      <div className="text-center space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">
                          {pkg.label}
                        </p>
                        <p className="text-2xl font-bold">${pkg.amount}</p>
                        <p className="text-xs text-muted-foreground">
                          {pkg.credits} credits
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <Label htmlFor="customAmount">Or Enter Custom Amount ($)</Label>
                <Input
                  id="customAmount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter amount in dollars"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedPackage(null);
                  }}
                />
                {customAmount && parseFloat(customAmount) > 0 && (
                  <p className="text-xs text-muted-foreground">
                    You will receive {parseFloat(customAmount) * 20} credits
                  </p>
                )}
              </div>

              {/* Payment Summary */}
              {(selectedPackage ||
                (customAmount && parseFloat(customAmount) > 0)) && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-sm">Payment Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">
                      $
                      {selectedPackage
                        ? creditPackages.find(
                            (pkg) => pkg.id === selectedPackage
                          )?.amount
                        : parseFloat(customAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Credits</span>
                    <span className="font-medium">
                      {selectedPackage
                        ? creditPackages.find(
                            (pkg) => pkg.id === selectedPackage
                          )?.credits
                        : parseFloat(customAmount) * 20}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      $
                      {selectedPackage
                        ? creditPackages.find(
                            (pkg) => pkg.id === selectedPackage
                          )?.amount
                        : parseFloat(customAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsRechargeDialogOpen(false);
                  setSelectedPackage(null);
                  setCustomAmount("");
                }}
                disabled={isRecharging}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRecharge}
                disabled={isRecharging || (!selectedPackage && !customAmount)}
                className="rounded-full shadow-lg shadow-primary/20"
              >
                {isRecharging ? (
                  <>
                    <Loader className="w-4 h-4 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
