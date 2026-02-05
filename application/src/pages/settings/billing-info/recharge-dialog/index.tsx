// import React, { useState } from "react";
// import PaymentSummary from "./PaymentSummary";
// import CustomAmount from "./CustomAmount";
// import CreditPackages from "./CreditPackages";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Loader, Wallet } from "lucide-react";
// import { CreditPackage } from "@/api/payments/types";

// interface RechargeDialogProps {
//   open: boolean;
//   onOpenChange: (val: boolean) => void;
// }

// const creditPackages = [
//   { id: 1, amount: 5, credits: 100, label: "Starter", popular: false },
//   { id: 2, amount: 10, credits: 200, label: "Popular", popular: true },
//   { id: 3, amount: 20, credits: 400, label: "Pro", popular: false },
// ];

// const RechargeDialog = ({ open, onOpenChange }: RechargeDialogProps) => {
//   const [selectedPackage, setSelectedPackage] = useState<CreditPackage>();

//   const handleRecharge = async () => {
//     const amount = selectedPackage
//       ? creditPackages.find((pkg) => pkg.id === selectedPackage)?.amount
//       : parseFloat(customAmount);

//     if (!amount || amount <= 0) {
//       toast.error("Please select a package or enter a valid amount");
//       return;
//     }

//     try {
//       // await rechargeCredits(amount);
//       toast.success(`Successfully recharged ${amount * 20} credits!`);
//       setIsRechargeDialogOpen(false);
//       setSelectedPackage(null);
//       setCustomAmount("");
//     } catch (error: any) {
//       console.error("Recharge error:", error);
//       toast.error(error?.response?.data?.error || "Failed to recharge credits");
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle>Recharge Credits</DialogTitle>
//           <DialogDescription>
//             Select a package or enter a custom amount to recharge your credits
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           <CreditPackages />
//           <CustomAmount />
//           <PaymentSummary />
//         </div>

//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={() => {
//               onOpenChange(false);
//               setSelectedPackage(null);
//               setCustomAmount("");
//             }}
//             // disabled={isRecharging}
//             className="rounded-full"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleRecharge}
//             // disabled={isRecharging || (!selectedPackage && !customAmount)}
//             className="rounded-full shadow-lg shadow-primary/20"
//           >
//             {/* {isRecharging ? ( */}(
//             <>
//               <Loader className="w-4 h-4 mr-2" />
//               Processing...
//             </>
//             ) : (
//             <>
//               <Wallet className="w-4 h-4 mr-2" />
//               Proceed to Payment
//             </>
//             )
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default RechargeDialog;
