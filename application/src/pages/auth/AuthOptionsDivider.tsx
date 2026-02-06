
const AuthOptionsDivider = () => {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border/60" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wider">
        <span className="bg-background px-3 text-muted-foreground/60 font-medium">
          Or continue with
        </span>
      </div>
    </div>
  );
};

export default AuthOptionsDivider;
