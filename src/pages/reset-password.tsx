import Logo from "@/assets/icons/logo";
import TravelLogin from "@/assets/images/travel-login.png";
import { ResetPasswordForm } from "@/components/modules/authentication/reset-password-form";
import { Link } from "react-router";

function ResetPassword() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={TravelLogin}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
        />
      </div>
    </div>
  );
}

export default ResetPassword;
