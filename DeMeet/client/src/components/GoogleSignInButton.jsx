import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from './ui/button';
import { signInWithGooglePopup, getGoogleAuthUrl } from '@/utils/googleAuth';
import axios from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';

const GoogleSignInButton = ({ disabled = false, variant = "outline", className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();

  // Method 1: Use popup with Google Identity Services
  const handleGoogleSignInPopup = async () => {
    setIsLoading(true);
    try {
      // Get Google user data using popup
      const googleUserData = await signInWithGooglePopup();
      
      // Send to backend for verification and account creation/linking
      const response = await axios.post('/users/auth/google/verify', googleUserData);
      
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        
        // Store user and tokens
        setUser(user);
        setTokens(accessToken, refreshToken);
        
        toast.success('Successfully signed in with Google!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Method 2: Direct redirect to backend OAuth URL (simpler and more reliable)
  const handleGoogleSignInRedirect = () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    toast.info('Redirecting to Google Sign-In...');
    
    // Redirect to backend OAuth endpoint
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <Button
      type="button"
      variant={variant}
      className={`w-full ${className}`}
      disabled={disabled || isLoading}
      onClick={handleGoogleSignInRedirect} // Using redirect method for better reliability
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Redirecting...
        </>
      ) : (
        <>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </>
      )}
    </Button>
  );
};

GoogleSignInButton.propTypes = {
  disabled: PropTypes.bool,
  variant: PropTypes.string,
  className: PropTypes.string,
};

export default GoogleSignInButton;
