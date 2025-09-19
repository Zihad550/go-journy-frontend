import Logo from '@/assets/icons/Logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NavbarAvailabilityControl } from '@/components/ui/navbar-availability-control';
import { MobileAvailabilityControl } from '@/components/ui/mobile-availability-control';
import { Role } from '@/constants';
import { DriverStatus } from '@/constants/driver.constant';
import { authApi, useLogoutMutation } from '@/redux/features/auth/auth.api';
import { useUserInfoQuery } from '@/redux/features/user/user.api';
import { useGetDriverProfileQuery } from '@/redux/features/driver/driver.api';
import { useAppDispatch } from '@/redux/hooks';
import { User } from 'lucide-react';

import { Link } from 'react-router';
import { ModeToggle } from './ModeToggle';

// Navigation links array to be used in both desktop and mobile menus
const publicNavigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
];

const dashboardLinks = [
  { href: '/admin', label: 'Dashboard', role: Role.ADMIN },
  { href: '/admin', label: 'Dashboard', role: Role.SUPER_ADMIN },
  { href: '/rider', label: 'Dashboard', role: Role.RIDER },
  { href: '/driver', label: 'Dashboard', role: Role.DRIVER },
];

// Helper function to get role display text
const getRoleDisplayText = (role: string) => {
  switch (role) {
    case Role.RIDER:
      return 'Rider';
    case Role.DRIVER:
      return 'Driver';
    case Role.ADMIN:
    case Role.SUPER_ADMIN:
      return 'Management';
    default:
      return '';
  }
};

export default function Navbar() {
  const { data } = useUserInfoQuery(undefined);
  const { data: driverProfile } = useGetDriverProfileQuery(undefined, {
    skip:
      !data?.data?.email ||
      (data?.data?.role !== Role.RIDER && data?.data?.role !== Role.DRIVER),
  });
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-2 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-1">
                  {/* Public Navigation Links */}
                  {publicNavigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink
                        asChild
                        className="py-2 px-3 rounded-md hover:bg-accent"
                      >
                        <Link to={link.href} className="text-sm font-medium">
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}

                  {/* Dashboard Link for Authenticated Users */}
                  {data?.data?.role && (
                    <>
                      <div className="w-full h-px bg-border my-2" />
                      {dashboardLinks
                        .filter((link) => link.role === data?.data?.role)
                        .map((link, index) => (
                          <NavigationMenuItem
                            key={`dashboard-${index}`}
                            className="w-full"
                          >
                            <NavigationMenuLink
                              asChild
                              className="py-2 px-3 rounded-md hover:bg-accent"
                            >
                              <Link
                                to={link.href}
                                className="text-sm font-medium"
                              >
                                {link.label}
                              </Link>
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        ))}
                    </>
                  )}

                  {/* Authentication Links */}
                  {!data?.data?.email && (
                    <>
                      <div className="w-full h-px bg-border my-2" />
                      <NavigationMenuItem className="w-full">
                        <NavigationMenuLink
                          asChild
                          className="py-2 px-3 rounded-md hover:bg-accent"
                        >
                          <Link to="/login" className="text-sm font-medium">
                            Login
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem className="w-full">
                        <NavigationMenuLink
                          asChild
                          className="py-2 px-3 rounded-md hover:bg-accent"
                        >
                          <Link to="/register" className="text-sm font-medium">
                            Sign Up
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-primary hover:text-primary/90 transition-colors"
            >
              <Logo />
            </Link>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-1">
                {/* Public Navigation Links */}
                {publicNavigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      asChild
                      className="text-muted-foreground hover:text-primary py-2 px-3 font-medium rounded-md transition-colors"
                    >
                      <Link to={link.href}>{link.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}

                {/* Dashboard Link for Authenticated Users */}
                {data?.data?.role && (
                  <>
                    <div className="w-px h-6 bg-border mx-2" />
                    {dashboardLinks
                      .filter((link) => link.role === data?.data?.role)
                      .map((link, index) => (
                        <NavigationMenuItem key={`dashboard-${index}`}>
                          <NavigationMenuLink
                            asChild
                            className="text-muted-foreground hover:text-primary py-2 px-3 font-medium rounded-md transition-colors"
                          >
                            <Link to={link.href}>{link.label}</Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Driver Availability Control */}
          {data?.data?.role === Role.DRIVER &&
            driverProfile?.data?.driverStatus === DriverStatus.APPROVED &&
            driverProfile?.data?.availability && (
              <div className="hidden sm:flex">
                <NavbarAvailabilityControl
                  currentAvailability={driverProfile.data.availability}
                  driverId={driverProfile.data._id}
                />
              </div>
            )}
          {/* Role Chip */}
          {data?.data?.role && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {getRoleDisplayText(data.data.role)}
            </Badge>
          )}
          <ModeToggle />
          {data?.data?.email && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {data?.data?.name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {data?.data?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Mobile Driver Availability Control */}
                  {data?.data?.role === Role.DRIVER &&
                    driverProfile?.data?.driverStatus ===
                      DriverStatus.APPROVED &&
                    driverProfile?.data?.availability && (
                      <>
                        <div className="px-2 py-1.5 sm:hidden">
                          <MobileAvailabilityControl
                            currentAvailability={
                              driverProfile.data.availability
                            }
                            driverId={driverProfile.data._id}
                          />
                        </div>
                        <DropdownMenuSeparator className="sm:hidden" />
                      </>
                    )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {data?.data?.role === Role.RIDER && (
                    <>
                      {!driverProfile?.data ? (
                        <DropdownMenuItem asChild>
                          <Link
                            to="/driver-registration"
                            className="cursor-pointer"
                          >
                            Become a Driver
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem asChild>
                          <Link
                            to="/driver-registration"
                            className="cursor-pointer"
                          >
                            Driver Profile
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                  {data?.data?.role && (
                    <DropdownMenuItem asChild>
                      <Link
                        to={
                          data.data.role === Role.ADMIN
                            ? '/admin'
                            : data.data.role === Role.SUPER_ADMIN
                            ? '/admin'
                            : data.data.role === Role.RIDER
                            ? '/rider'
                            : '/driver'
                        }
                        className="cursor-pointer"
                      >
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {!data?.data?.email && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                asChild
                className="text-sm hidden sm:inline-flex"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="text-sm">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
