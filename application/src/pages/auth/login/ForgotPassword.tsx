import { Link } from "react-router";

const ForgotPassword = () => {
  return (
    <div className="flex justify-end">
      <Link
        to="/forgot-password"
        className="text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        Forgot password?
      </Link>
    </div>
  );
};

export default ForgotPassword;
