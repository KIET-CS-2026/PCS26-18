// Google Authentication utility
const GOOGLE_CLIENT_ID = "717432159606-7l81pdv9q543updjjjsd8tnlj5chsrrn.apps.googleusercontent.com";

export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    // Load Google API script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setTimeout(resolve, 100); // Give Google API time to initialize
      };
      script.onerror = reject;
      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
};

export const signInWithGooglePopup = () => {
  return new Promise((resolve, reject) => {
    initializeGoogleAuth()
      .then(() => {
        if (!window.google?.accounts?.id) {
          throw new Error('Google API not properly loaded');
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            try {
              if (!response.credential) {
                throw new Error('No credential received from Google');
              }
              
              const userInfo = JSON.parse(atob(response.credential.split('.')[1]));
              resolve({
                idToken: response.credential,
                googleId: userInfo.sub,
                name: userInfo.name,
                email: userInfo.email,
                avatar: userInfo.picture,
              });
            } catch (error) {
              reject(new Error(`Failed to parse Google response: ${error.message}`));
            }
          },
          error_callback: (error) => {
            reject(new Error(`Google Sign-In error: ${error.type}`));
          }
        });

        // Use the prompt method which handles the popup automatically
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            reject(new Error('Google Sign-In popup was blocked or not displayed'));
          } else if (notification.isSkippedMoment()) {
            reject(new Error('Google Sign-In was skipped by user'));
          } else if (notification.isDismissedMoment()) {
            reject(new Error('Google Sign-In was dismissed by user'));
          }
        });

        // Add a timeout to prevent hanging
        setTimeout(() => {
          reject(new Error('Google Sign-In timeout - please try again'));
        }, 30000); // 30 second timeout
      })
      .catch(reject);
  });
};

// Alternative method using OAuth popup window
export const signInWithGoogleOAuthPopup = () => {
  return new Promise((resolve, reject) => {
    const redirectUri = encodeURIComponent('http://localhost:8000/api/users/auth/google/callback');
    const scope = encodeURIComponent('profile email');
    const responseType = 'code';
    const accessType = 'offline';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scope}&` +
      `response_type=${responseType}&` +
      `access_type=${accessType}`;

    const popup = window.open(
      authUrl,
      'google-signin',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        reject(new Error('Google Sign-In popup was closed'));
      }
    }, 1000);

    // Listen for the popup to be redirected back to our callback
    const messageHandler = (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        clearInterval(checkClosed);
        popup.close();
        window.removeEventListener('message', messageHandler);
        resolve(event.data.user);
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        clearInterval(checkClosed);
        popup.close();
        window.removeEventListener('message', messageHandler);
        reject(new Error(event.data.error));
      }
    };

    window.addEventListener('message', messageHandler);

    // Timeout after 2 minutes
    setTimeout(() => {
      if (!popup.closed) {
        popup.close();
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        reject(new Error('Google Sign-In timeout'));
      }
    }, 120000);
  });
};

export const getGoogleAuthUrl = () => {
  const baseUrl = 'http://localhost:8000/api/users/auth/google';
  return baseUrl;
};
