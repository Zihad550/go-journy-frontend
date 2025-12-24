import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Password from "@/components/ui/password";
import { cn } from "@/lib/utils";
import { useResetPasswordMutation } from "@/redux/features/auth/auth-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import z from "zod";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [resetPassword, { isLoading, isSuccess }] =
    useResetPasswordMutation(undefined);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    try {
      await resetPassword({
        token,
        newPassword: data.password,
      }).unwrap();

      toast.success("Password reset successfully");

      navigate("/login");
    } catch (err: any) {
      if (err?.data?.message === "jwt expired")
        toast.error("Link expired, Please request a new reset lin");
      else
        toast.error(
          "Failed to reset password. Please try again or request a new reset link.",
        );
    }
  };

  // Show error if no token is present
  if (!token) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
          <p className="text-balance text-sm text-muted-foreground">
            This reset link is invalid or has expired. Please request a new
            password reset.
          </p>
        </div>
        <div className="grid gap-4">
          <Link to="/forgot-password">
            <Button className="w-full">Request New Reset Link</Button>
          </Link>
          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link to="/login" replace className="underline underline-offset-4">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show success message
  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Password Reset Successful</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Your password has been successfully reset. You will be redirected to
            the login page shortly.
          </p>
        </div>
        <div className="grid gap-4">
          <Link to="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your new password below to complete the reset process
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Password
                      {...field}
                      value={field.value || ""}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Password
                      {...field}
                      value={field.value || ""}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link to="/login" replace className="underline underline-offset-4">
          Back to login
        </Link>
      </div>
    </div>
  );
}
