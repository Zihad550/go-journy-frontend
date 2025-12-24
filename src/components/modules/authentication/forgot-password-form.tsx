import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForgotPasswordMutation } from "@/redux/features/auth/auth-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import z from "zod";

const forgot_password_schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [is_submitted, set_is_submitted] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation(undefined);

  const form = useForm<z.infer<typeof forgot_password_schema>>({
    resolver: zodResolver(forgot_password_schema),
    defaultValues: {
      email: "",
    },
  });

  const on_submit = async (data: z.infer<typeof forgot_password_schema>) => {
    try {
      await forgotPassword(data).unwrap();

      set_is_submitted(true);
      toast.success("Password reset instructions sent to your email");
    } catch {
      toast.error("Failed to send reset instructions. Please try again.");
    }
  };

  if (is_submitted) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-balance text-sm text-muted-foreground">
            We've sent password reset instructions to{" "}
            <span className="font-medium">{form.getValues("email")}</span>
          </p>
        </div>
        <div className="grid gap-4">
          <Button
            onClick={() => set_is_submitted(false)}
            variant="outline"
            className="w-full"
          >
            Didn't receive the email? Try again
          </Button>
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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email address and we'll send you instructions to reset your
          password
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(on_submit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
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
              {isLoading ? "Sending..." : "Send reset instructions"}
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
