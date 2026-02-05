// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const CustomAmount = () => {
//   return (
//     <div className="space-y-2">
//       <Label htmlFor="customAmount">Or Enter Custom Amount ($)</Label>
//       <Input
//         id="customAmount"
//         type="number"
//         min="1"
//         step="1"
//         placeholder="Enter amount in dollars"
//         value={customAmount}
//         onChange={(e) => {
//           setCustomAmount(e.target.value);
//           setSelectedPackage(null);
//         }}
//       />
//       {customAmount && parseFloat(customAmount) > 0 && (
//         <p className="text-xs text-muted-foreground">
//           You will receive {parseFloat(customAmount) * 20} credits
//         </p>
//       )}
//     </div>
//   );
// };

// export default CustomAmount;
