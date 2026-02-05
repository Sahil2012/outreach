// import React from "react";

// const PaymentSummary = () => {
//   if (!selectedPackage || !(customAmount && parseFloat(customAmount) > 0)) {
//     return null;
//   }

//   return (
//     <div className="bg-muted/50 rounded-lg p-4 space-y-2">
//       <h4 className="font-semibold text-sm">Payment Summary</h4>
//       <div className="flex justify-between text-sm">
//         <span className="text-muted-foreground">Amount</span>
//         <span className="font-medium">
//           $
//           {selectedPackage
//             ? creditPackages.find((pkg) => pkg.id === selectedPackage)?.amount
//             : parseFloat(customAmount).toFixed(2)}
//         </span>
//       </div>
//       <div className="flex justify-between text-sm">
//         <span className="text-muted-foreground">Credits</span>
//         <span className="font-medium">
//           {selectedPackage
//             ? creditPackages.find((pkg) => pkg.id === selectedPackage)?.credits
//             : parseFloat(customAmount) * 20}
//         </span>
//       </div>
//       <div className="border-t border-border pt-2 flex justify-between font-semibold">
//         <span>Total</span>
//         <span>
//           $
//           {selectedPackage
//             ? creditPackages.find((pkg) => pkg.id === selectedPackage)?.amount
//             : parseFloat(customAmount).toFixed(2)}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default PaymentSummary;
