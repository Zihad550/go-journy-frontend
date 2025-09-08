import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CardLoader } from '@/components/ui/card-loader';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ButtonSpinner } from '@/components/ui/spinner';
import { DriverStatus } from '@/constants/driver.constant';
import {
  useGetDriverProfileQuery,
  useRegisterDriverMutation,
} from '@/redux/features/driver/driver.api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Car,
  CheckCircle,
  Clock,
  RefreshCw,
  User,
  XCircle,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const driverRegistrationSchema = z.object({
  vehicle: z.object({
    name: z.string().min(1, 'Vehicle name is required'),
    model: z.string().min(1, 'Vehicle model is required'),
  }),
  experience: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? 'Experience is required'
          : 'Experience must be a number',
    })
    .min(0, 'Experience must be at least 0 years')
    .max(50, 'Experience cannot exceed 50 years'),
});

type DriverRegistrationFormData = z.infer<typeof driverRegistrationSchema>;

export default function DriverRegistration() {
  const {
    data: driverProfile,
    isLoading: isLoadingProfile,
    refetch,
  } = useGetDriverProfileQuery(undefined);
  console.log(driverProfile);
  const [registerDriver, { isLoading }] = useRegisterDriverMutation();

  const form = useForm<DriverRegistrationFormData>({
    resolver: zodResolver(driverRegistrationSchema),
    defaultValues: {
      vehicle: {
        name: '',
        model: '',
      },
      experience: undefined,
    },
  });

  const onSubmit = async (data: DriverRegistrationFormData) => {
    try {
      const result = await registerDriver(data).unwrap();

      if (result.success) {
        toast.success(
          'Driver registration submitted successfully! Your application is under review.'
        );
        refetch(); // Refresh the driver profile to show the new status
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case DriverStatus.PENDING:
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case DriverStatus.APPROVED:
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 border-green-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case DriverStatus.REJECTED:
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-200"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case DriverStatus.PENDING:
        return <Clock className="h-12 w-12 text-yellow-600" />;
      case DriverStatus.APPROVED:
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case DriverStatus.REJECTED:
        return <XCircle className="h-12 w-12 text-red-600" />;
      default:
        return <Car className="h-12 w-12 text-primary" />;
    }
  };

  // Helper function to get status message
  const getStatusMessage = (status: string) => {
    switch (status) {
      case DriverStatus.PENDING:
        return {
          title: 'You Already Have a Pending Request',
          description:
            "Your driver application has been submitted and is currently being reviewed by our team. We'll notify you once a decision has been made.",
        };
      case DriverStatus.APPROVED:
        return {
          title: 'Application Approved!',
          description:
            'Congratulations! Your driver application has been approved. You can now start accepting ride requests.',
        };
      case DriverStatus.REJECTED:
        return {
          title: 'Application Rejected',
          description:
            'Unfortunately, your driver application was not approved at this time. You may reapply after addressing any feedback provided.',
        };
      default:
        return {
          title: 'Become a Driver',
          description:
            'Join our platform and start earning by providing rides to passengers',
        };
    }
  };

  // Show loading state
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-chart-2/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-2xl mx-auto">
            <CardLoader message="Loading your driver application status..." />
          </div>
        </div>
      </div>
    );
  }

  // If user has a driver profile, show status instead of form
  if (driverProfile?.data) {
    const driver = driverProfile.data;
    const statusInfo = getStatusMessage(driver.driverStatus);

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-chart-2/5 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-chart-2/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  {getStatusIcon(driver.driverStatus)}
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">{statusInfo.title}</h1>
              <p className="text-muted-foreground">{statusInfo.description}</p>
            </div>

            {/* Status Card */}
            <Card className="backdrop-blur-sm bg-background/95 border shadow-xl">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {getStatusBadge(driver.driverStatus)}
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  <User className="h-5 w-5" />
                  Driver Application Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      Vehicle Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Vehicle Name:
                        </span>
                        <p className="font-medium">{driver.vehicle.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Vehicle Model:
                        </span>
                        <p className="font-medium">{driver.vehicle.model}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Experience
                    </h3>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Years of Experience:
                      </span>
                      <p className="font-medium">{driver.experience} years</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  {driver.driverStatus === DriverStatus.APPROVED && (
                    <Button asChild className="w-full" size="lg">
                      <Link to="/driver">
                        <Car className="h-5 w-5 mr-2" />
                        Go to Driver Dashboard
                      </Link>
                    </Button>
                  )}

                  {driver.driverStatus === DriverStatus.REJECTED && (
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Apply Again
                    </Button>
                  )}

                  <Button asChild variant="outline" className="w-full">
                    <Link to="/profile">
                      <User className="h-5 w-5 mr-2" />
                      Back to Profile
                    </Link>
                  </Button>
                </div>

                {/* Info Text */}
                <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                  <p>
                    Application submitted on{' '}
                    {new Date(driver.createdAt).toLocaleDateString()}
                  </p>
                  {driver.driverStatus === DriverStatus.PENDING && (
                    <p className="mt-1">
                      We typically review applications within 2-3 business days.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-chart-2/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-chart-2/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Car className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Become a Driver</h1>
            <p className="text-muted-foreground">
              Join our platform and start earning by providing rides to
              passengers
            </p>
          </div>

          {/* Registration Form */}
          <Card className="backdrop-blur-sm bg-background/95 border shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <User className="h-5 w-5" />
                Driver Registration
              </CardTitle>
              <CardDescription>
                Please provide your vehicle information and driving experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Vehicle Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      Vehicle Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="vehicle.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Toyota Camry"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vehicle.model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle Model</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 2020"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Driving Experience
                    </h3>

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Driving Experience</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 5"
                              min="0"
                              max="50"
                              value={field.value || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === '' ? undefined : Number(value)
                                );
                              }}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <ButtonSpinner />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Submit Driver Application
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Info Text */}
                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      Your application will be reviewed by our team. You'll be
                      notified once approved.
                    </p>
                    <p className="mt-2">
                      Already have an account?{' '}
                      <Link
                        to="/profile"
                        className="text-primary hover:underline"
                      >
                        Go to Profile
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
