const PlanInformation = () => {
  return (
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
  );
};

export default PlanInformation;
