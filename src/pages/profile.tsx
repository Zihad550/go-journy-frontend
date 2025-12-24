import { ChangePasswordForm } from "@/components/modules/profile/change-password-form";
import { DriverProfile } from "@/components/modules/profile/driver-profile";
import { UpdateProfileForm } from "@/components/modules/profile/update-profile-form";
import { NotFound } from "@/components/ui/not-found";
import { PageSpinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Role } from "@/constants/role-constant";
import { useUserInfoQuery } from "@/redux/features/user/user-api";
import { Link, useNavigate } from "react-router";
import Logo from "@/assets/icons/logo";

function Profile() {
  const { data, isLoading } = useUserInfoQuery(undefined);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  const currentUser = data?.data;
  if (isLoading) return <PageSpinner message="Loading user..." />;
  if (!currentUser)
    return (
      <NotFound
        variant="error"
        title="Something went wrong"
        message="We encountered an error."
        showRetry={false}
        onGoBack={handleGoBack}
      />
    );

  const isDriver = currentUser.role === Role.DRIVER;

  return (
    <div className="min-h-svh bg-background">
      <div className="container mx-auto max-w-4xl p-6 md:p-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <Logo />
          </Link>
          <div className="text-right">
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  currentUser.isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {currentUser.isVerified ? "✓ Verified" : "⚠ Unverified"}
              </span>
              {!currentUser.isVerified && (
                <Link
                  to="/verify-otp"
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Verify Email
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList
              className={`grid w-full ${
                isDriver ? "grid-cols-3" : "grid-cols-2"
              }`}
            >
              <TabsTrigger value="profile">Update Profile</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
              {isDriver && (
                <TabsTrigger value="driver">Driver Profile</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <div className="rounded-lg border bg-card p-6">
                <UpdateProfileForm
                  currentName={currentUser.name}
                  currentAddress={currentUser.address}
                />
              </div>
            </TabsContent>

            <TabsContent value="password" className="mt-6">
              <div className="rounded-lg border bg-card p-6">
                <ChangePasswordForm />
              </div>
            </TabsContent>

            {isDriver && (
              <TabsContent value="driver" className="mt-6">
                <DriverProfile />
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;
