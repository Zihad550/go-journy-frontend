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
import Password from "@/components/ui/password";
import { ButtonSpinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/features/auth/auth-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useState } from "react";
import config, { demoCredentials } from "@/config";
import z from "zod";

const login_schema = z.object({
  email: z.email(),
  password: z.string().min(8, { error: "Password is too short" }),
});

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [state] = useState(location.state);

  console.log("state on login -", state);
  const [searchParams] = useSearchParams();
  const form = useForm<z.infer<typeof login_schema>>({
    resolver: zodResolver(login_schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [login, { isLoading }] = useLoginMutation();
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const on_submit = async (data: z.infer<typeof login_schema>) => {
    try {
      const res = await login(data).unwrap();
      console.log(res);

      if (res.success) {
        toast.success("Logged in successfully");
        const redirect = searchParams.get("redirect") || "/";
        navigate(redirect, { state });
      }
    } catch (err: any) {
      console.log(err);
      if (err?.data?.message === "Password does not match") {
        toast.error("Invalid credentials");
      } else if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }

      if (err?.data?.message === "User is not verified") {
        toast.error("Your account is not verified");
        navigate("/verify-otp", { state: data.email });
      }
    }
  };

  const handleDemoLogin = async (role: "driver" | "rider" | "admin") => {
    setDemoLoading(role);
    try {
      const res = await login(demoCredentials[role]).unwrap();
      if (res.success) {
        toast.success(`Logged in as demo ${role}`);
        const redirect = searchParams.get("redirect") || "/";
        navigate(redirect, { state });
      }
    } catch (err: any) {
      if (err?.data?.message === "Password does not match") {
        toast.error("Invalid demo credentials");
      } else if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error("Demo login failed. Please try again.");
      }

      if (err?.data?.message === "User is not verified") {
        toast.error("Demo account is not verified");
        navigate("/verify-otp", { state: demoCredentials[role].email });
      }
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Password
                      placeholder="********"
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
              {isLoading && <ButtonSpinner />}
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <Button
          onClick={() => {
            window.location.href = `${config.baseUrl}/auth/google`;
          }}
          type="button"
          variant="outline"
          className="w-full cursor-pointer"
        >
          Login with Google
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with a demo account
          </span>
        </div>

        <div className="grid gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleDemoLogin("driver")}
            disabled={demoLoading !== null}
          >
            {demoLoading === "driver" ? "Loading..." : "Demo Driver"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleDemoLogin("rider")}
            disabled={demoLoading !== null}
          >
            {demoLoading === "rider" ? "Loading..." : "Demo Rider"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleDemoLogin("admin")}
            disabled={demoLoading !== null}
          >
            {demoLoading === "admin" ? "Loading..." : "Demo Admin"}
          </Button>
        </div>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" replace className="underline underline-offset-4">
          Register
        </Link>
      </div>
      <div className="text-center text-sm">
        Don&apos;t remember password?{" "}
        <Link
          to="/forgot-password"
          replace
          className="underline underline-offset-4"
        >
          Reset password
        </Link>
      </div>
    </div>
  );
}
