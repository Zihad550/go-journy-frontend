import Logo from "@/assets/icons/logo";
import TravelLogin from "@/assets/images/travel-login.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/auth-api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Mail,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function Verify() {
  const location = useLocation();
  const [email] = useState(location.state);
  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [timer, setTimer] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const handleSendOtp = async () => {
    setIsLoading(true);
    setOtpError("");
    const toastId = toast.loading("Sending OTP");

    try {
      const res = await sendOtp({ email: email, name: "User" }).unwrap();

      if (res.success) {
        toast.success("OTP Sent", { id: toastId });
        setShowOtpInput(true);
        setTimer(120);
      }
    } catch {
      toast.error("Failed to send OTP", { id: toastId });
      setOtpError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setOtpError("");
    const toastId = toast.loading("Verifying OTP");
    const userInfo = {
      email,
      otp: data.pin,
    };

    try {
      const res = await verifyOtp(userInfo).unwrap();
      if (res.success) {
        toast.success("OTP Verified", { id: toastId });
        navigate("/login");
      }
    } catch {
      toast.error("Invalid OTP", { id: toastId });
      setOtpError("Invalid verification code. Please check and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSendOtp = () => {
    setShowOtpInput(false);
    setOtpError("");
    setTimer(60);
    form.reset();
  };

  const handleAlreadyHaveCode = () => {
    setShowOtpInput(true);
    setOtpError("");
  };

  useEffect(() => {
    if (!email) navigate("/");
    if (!showOtpInput) {
      return;
    }

    const timerId = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [email, showOtpInput, navigate]);

  return (
    <div className="min-h-svh bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 lg:grid lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-8 sm:py-12">
          <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-0">
            {showOtpInput ? (
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/50 backdrop-blur-xl relative overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl translate-y-12 -translate-x-12" />

                <CardHeader className="text-center pb-4 px-4 sm:px-6 md:px-8 relative z-10">
                  <div className="flex justify-start mb-4">
                    <Button
                      onClick={handleBackToSendOtp}
                      variant="ghost"
                      size="sm"
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      ← Back
                    </Button>
                  </div>
                  <div className="mx-auto mb-4 sm:mb-6 flex size-14 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg border border-primary/20">
                    <Shield className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Verify your email
                  </CardTitle>
                  <CardDescription className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    We've sent a 6-digit verification code to
                    <br />
                    <span className="font-semibold text-primary">{email}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-4 sm:px-6 md:px-8 relative z-10">
                  <Form {...form}>
                    <form
                      id="otp-form"
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4 sm:space-y-6 md:space-y-8"
                    >
                      <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                          <FormItem className="space-y-3 sm:space-y-4 md:space-y-6">
                            <FormLabel className="text-center block text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300">
                              Enter verification code
                            </FormLabel>
                            <FormControl>
                              <div className="flex justify-center">
                                <InputOTP
                                  maxLength={6}
                                  {...field}
                                  className="gap-2 sm:gap-3"
                                >
                                  <InputOTPGroup className="gap-2 sm:gap-3">
                                    <InputOTPSlot
                                      index={0}
                                      className="size-10 md:size-14 text-xl sm:text-2xl font-bold border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/20 bg-white dark:bg-slate-800 shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
                                    />
                                    <InputOTPSlot
                                      index={1}
                                      className="size-10 md:size-14 text-xl sm:text-2xl font-bold border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/20 bg-white dark:bg-slate-800 shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
                                    />
                                    <InputOTPSlot
                                      index={2}
                                      className="size-10 md:size-14 text-xl sm:text-2xl font-bold border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/20 bg-white dark:bg-slate-800 shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
                                    />
                                    <InputOTPSlot
                                      index={3}
                                      className="size-10 md:size-14 text-xl sm:text-2xl font-bold border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/20 bg-white dark:bg-slate-800 shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
                                    />
                                    <InputOTPSlot
                                      index={4}
                                      className="size-10 md:size-14 text-xl sm:text-2xl font-bold border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/20 bg-white dark:bg-slate-800 shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
                                    />
                                    <InputOTPSlot
                                      index={5}
                                      className="size-10 md:size-14 text-xl sm:text-2xl font-bold border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/20 bg-white dark:bg-slate-800 shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
                                    />
                                  </InputOTPGroup>
                                </InputOTP>
                              </div>
                            </FormControl>

                            {/* Error Message */}
                            {otpError && (
                              <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{otpError}</span>
                              </div>
                            )}

                            <div className="text-muted-foreground text-sm text-center space-y-3">
                              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Clock className="h-4 w-4" />
                                <span>Didn't receive the code?</span>
                              </div>
                              <Button
                                onClick={handleSendOtp}
                                type="button"
                                variant="ghost"
                                disabled={timer !== 0 || isLoading}
                                className={cn(
                                  "font-medium text-primary hover:text-primary/80 hover:bg-primary/5 px-4 py-2 rounded-lg transition-all duration-200",
                                  {
                                    "cursor-pointer": timer === 0,
                                    "text-slate-400 cursor-not-allowed":
                                      timer !== 0,
                                  },
                                )}
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sending...
                                  </>
                                ) : timer > 0 ? (
                                  `Resend in ${timer}s`
                                ) : (
                                  "Resend Code"
                                )}
                              </Button>
                            </div>
                            <FormMessage className="text-center" />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>

                <CardFooter className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 relative z-10">
                  <Button
                    form="otp-form"
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 sm:h-16 font-semibold text-base sm:text-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0 active:scale-[0.98] touch-manipulation"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Verify & Continue
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/50 backdrop-blur-xl relative overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl translate-y-12 -translate-x-12" />

                <CardHeader className="text-center pb-6 px-4 sm:px-6 md:px-8 relative z-10">
                  <div className="mx-auto mb-4 sm:mb-6 flex size-14 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg border border-primary/20">
                    <Mail className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Email Verification
                  </CardTitle>
                  <CardDescription className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    We'll send a secure verification code to
                    <br />
                    <span className="font-semibold text-primary">{email}</span>
                  </CardDescription>
                  <div className="mt-4 text-center">
                    <Button
                      onClick={handleAlreadyHaveCode}
                      variant="link"
                      className="text-primary hover:text-primary/80 text-sm font-medium p-0 h-auto"
                    >
                      I already have a code
                    </Button>
                  </div>
                </CardHeader>

                {/* Error Message */}
                {otpError && (
                  <div className="px-4 sm:px-6 md:px-8 pb-4 relative z-10">
                    <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  </div>
                )}

                <CardFooter className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 relative z-10">
                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full h-14 sm:h-16 font-semibold text-base sm:text-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0 active:scale-[0.98] touch-manipulation"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        <Mail className="h-5 w-5 mr-2" />
                        Send Verification Code
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={TravelLogin}
          alt="Email verification"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
        />
        {/* Mobile background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 lg:hidden" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl lg:hidden" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-primary/5 rounded-full blur-2xl lg:hidden" />
      </div>
    </div>
  );
}
