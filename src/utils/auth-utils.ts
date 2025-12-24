import { toast } from "sonner";

export interface AuthError {
  status: number;
  message?: string;
  data?: any;
}

export const handleAuthError = (error: AuthError) => {
  switch (error.status) {
    case 401:
      // Unauthorized - token expired or invalid
      toast.error("Session expired. Please login again.");
      // Clear any stored auth state
      localStorage.clear();
      sessionStorage.clear();
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      break;
    case 403:
      // Forbidden - user blocked or not verified
      if (error.data?.message?.includes('blocked')) {
        toast.error("Your account has been blocked. Please contact support.");
      } else if (error.data?.message?.includes('verified')) {
        toast.error("Please verify your email before proceeding.");
        window.location.href = '/verify-otp';
      } else {
        toast.error("Access denied. You don't have permission to perform this action.");
      }
      break;
    case 404:
      // User not found
      toast.error("User not found. Please check your credentials.");
      break;
    case 422:
      // Validation error
      toast.error(error.data?.message || "Invalid input data.");
      break;
    case 429:
      // Rate limit exceeded
      toast.error("Too many requests. Please try again later.");
      break;
    default:
      toast.error(error.data?.message || "An authentication error occurred.");
  }
};

export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    // Try to access a protected endpoint to check auth status
    const response = await fetch('/api/v1/users/profile', {
      credentials: 'include',
    });

    if (response.status === 401) {
      // Token expired or invalid
      return false;
    }

    return response.ok;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};

export const refreshAuthToken = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/v1/auth/refresh-token', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (data.success) {
      return true;
    } else {
      // Refresh failed, redirect to login
      window.location.href = '/login';
      return false;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    window.location.href = '/login';
    return false;
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (data.success) {
      // Clear any client-side state
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Logged out successfully");
      // Redirect to login
      window.location.href = '/login';
    } else {
      toast.error("Logout failed");
    }
  } catch (error) {
    console.error('Logout failed:', error);
    // Still clear local state and redirect
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }
};