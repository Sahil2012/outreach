// import { CreditPackage } from "@/api/payments/types";
// import { Label } from "@/components/ui/label";

// interface CreditPackagesProps {
//   creditPackages: CreditPackage[];
// }

// const CreditPackages = ({ creditPackages }: CreditPackagesProps) => {
//   return (
//     <div className="space-y-3">
//       <Label>Select Package</Label>
//       <div className="grid grid-cols-3 gap-3">
//         {creditPackages.map((pkg) => (
//           <button
//             key={pkg.id}
//             onClick={() => {
//               setSelectedPackage(pkg.id);
//               setCustomAmount("");
//             }}
//             className={`relative p-4 rounded-lg border-2 transition-all ${
//               selectedPackage === pkg.id
//                 ? "border-primary bg-primary/5"
//                 : "border-border hover:border-primary/50"
//             }`}
//           >
//             {pkg.popular && (
//               <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
//                 Popular
//               </div>
//             )}
//             <div className="text-center space-y-1">
//               <p className="text-xs text-muted-foreground font-medium">
//                 {pkg.label}
//               </p>
//               <p className="text-2xl font-bold">${pkg.amount}</p>
//               <p className="text-xs text-muted-foreground">
//                 {pkg.credits} credits
//               </p>
//             </div>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CreditPackages;
