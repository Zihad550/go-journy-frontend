import Logo from "@/assets/icons/Logo";
import { ChangePasswordForm } from "@/components/modules/Profile/ChangePasswordForm";
import { UpdateProfileForm } from "@/components/modules/Profile/UpdateProfileForm";
import { NotFound } from "@/components/ui/not-found";
import { PageSpinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserInfoQuery } from "@/redux/features/user/user.api";
import { Link, useNavigate } from "react-router";

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
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-2xl">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Update Profile</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <div className="rounded-lg border bg-card p-6">
                <UpdateProfileForm currentName={currentUser.name} />
              </div>
            </TabsContent>

            <TabsContent value="password" className="mt-6">
              <div className="rounded-lg border bg-card p-6">
                <ChangePasswordForm />
              </div>
            </TabsContent>
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
