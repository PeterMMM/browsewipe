import React, { useState, useEffect, useRef } from 'react';

// AuthenticatedViewをApp外に移動
const AuthenticatedView = ({
  username,
  profileInfo,
  profileLabelInput,
  setProfileLabelInput,
  isUpdatingLabel,
  updateProfileLabel,
  handleLogout,
  profileLabelInputRef,
  isLoading,
}) => (
  <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md">
    <h2 className="text-xl font-bold text-gray-800">Welcome {username}!</h2>
    <p className="mt-2 text-gray-600">You are successfully logged in.</p>
    
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Profile Settings</h3>
      <div className="space-y-2">
        <div>
          <label className="text-xs text-gray-600">Profile UUID:</label>
          <p className="text-xs font-mono text-gray-800 break-all">
            {profileInfo?.profileUuid || 'Loading...'}
          </p>
        </div>
        <div>
          <label className="text-xs text-gray-600">Profile Label:</label>
          <div className="flex gap-2 mt-1">
            <input
              ref={profileLabelInputRef}
              type="text"
              placeholder="Enter profile name (optional)"
              value={profileLabelInput}
              onChange={(e) => setProfileLabelInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') updateProfileLabel();
              }}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={updateProfileLabel}
              disabled={isUpdatingLabel}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {isUpdatingLabel ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  </div>
);

// LoginFormをApp外に移動
const LoginForm = ({ message, handleLogin, isLoading, profileInfo, setCurrentView }) => (
  <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-xl">
    <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
    <p className="text-red-500 text-center mt-2 h-6">{message}</p>
    <form onSubmit={handleLogin} className="mt-4 space-y-4">
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
      >
        {isLoading ? 'Logging In...' : 'Login'}
      </button>
    </form>
    
    {/* Profile information display */}
    {profileInfo && (
      <div className="mt-4 p-2 bg-gray-50 rounded text-xs">
        <p className="text-gray-600">Profile: {profileInfo.profileLabel || 'Unnamed'}</p>
        <p className="text-gray-500 font-mono">{profileInfo.profileUuid?.slice(0, 8)}...</p>
      </div>
    )}
    
    <div className="mt-4 text-center text-sm">
      <span className="text-gray-600">Don't have an account?</span>
      <button
        onClick={() => setCurrentView('register')}
        className="ml-1 text-blue-500 hover:text-blue-700 font-semibold"
      >
        Register
      </button>
    </div>
  </div>
);

// RegisterFormをApp外に移動
const RegisterForm = ({ message, handleRegister, isLoading, setCurrentView }) => (
  <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-xl">
    <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
    <p className="text-red-500 text-center mt-2 h-6">{message}</p>
    <form onSubmit={handleRegister} className="mt-4 space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Name"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300"
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
    <div className="mt-4 text-center text-sm">
      <span className="text-gray-600">Already have an account?</span>
      <button
        onClick={() => setCurrentView('login')}
        className="ml-1 text-blue-500 hover:text-blue-700 font-semibold"
      >
        Login
      </button>
    </div>
  </div>
);

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('login');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const [profileLabelInput, setProfileLabelInput] = useState('');
  const [isUpdatingLabel, setIsUpdatingLabel] = useState(false);
  const profileLabelInputRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const loginUrl = `${API_URL}/auth/login`;
  const registerUrl = `${API_URL}/auth/register`;
  const updateProfileLabelUrl = `${API_URL}/auth/profile/label`;
  const logoutUrl = `${API_URL}/auth/logout`;

  /**
   * Get profile information
   */
  const getProfileInfo = async () => {
    const { profileUuid, profileLabel, browserId } = await chrome.storage.local.get(['profileUuid', 'profileLabel', 'browserId']);
    
    let finalProfileUuid = profileUuid;
    if (!finalProfileUuid) {
      finalProfileUuid = crypto.randomUUID();
      await chrome.storage.local.set({ profileUuid: finalProfileUuid });
      console.log('Generated new profile UUID for React app:', finalProfileUuid);
    }
    
    return {
      profileUuid: finalProfileUuid,
      profileLabel: profileLabel || null,
      browserId: browserId || chrome.runtime.id
    };
  };

  /**
   * Update profile label
   */
  const updateProfileLabel = async () => {
    setIsUpdatingLabel(true);
    try {
      // Trim and validate the label
      const trimmedLabel = profileLabelInput ? profileLabelInput.trim() : '';
      
      // Update local storage first
      if (trimmedLabel) {
        await chrome.storage.local.set({ profileLabel: trimmedLabel });
        console.log('Profile label updated locally:', trimmedLabel);
      } else {
        await chrome.storage.local.remove(['profileLabel']);
        console.log('Profile label removed locally');
      }
      
      // Get updated info for API call but don't update state during input
      const updatedInfo = await getProfileInfo();
      
      // Call backend API to update database
      const { authToken } = await chrome.storage.local.get(['authToken']);
      if (authToken) {
        try {
          const response = await fetch(updateProfileLabelUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
              'X-Broswer-Id': updatedInfo.browserId,
              'X-Profile-Uuid': updatedInfo.profileUuid
            },
            body: JSON.stringify({ profileLabel: trimmedLabel })
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Profile label updated in database:', data);
            setMessage('Profile label updated successfully!');
            setTimeout(() => setMessage(''), 3000);
          } else {
            console.error('Failed to update profile label in database:', response.status);
            setMessage('Failed to update profile label.');
            setTimeout(() => setMessage(''), 3000);
          }
        } catch (apiError) {
          console.error('API call failed for profile label update:', apiError);
          setMessage('Network error while updating profile label.');
          setTimeout(() => setMessage(''), 3000);
        }
      }
    } catch (error) {
      console.error('Failed to update profile label:', error);
      setMessage('Failed to update profile label.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsUpdatingLabel(false);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const result = await chrome.storage.local.get(['authToken']);
        const profileInfo = await getProfileInfo();
        setProfileInfo(profileInfo);
        setProfileLabelInput(profileInfo.profileLabel || '');
        
        if (result.authToken) {
          const userResult = await chrome.storage.local.get(['username']);
          const username = userResult.username;
          setIsLoggedIn(true);
          setMessage('Welcome back!');
          setUsername(username ?? '-');
          console.log('User session restored for profile:', profileInfo.profileUuid);
        } else {
          setIsLoggedIn(false);
          setUsername(null);
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Failed to check authentication status:', error);
      }
    };
    checkToken();
  }, []);

  // プロファイル情報を更新するuseEffect（入力完了後）
  useEffect(() => {
    if (!isUpdatingLabel) {
      // 更新が完了した後にプロファイル情報を同期
      const syncProfileInfo = async () => {
        const updatedInfo = await getProfileInfo();
        setProfileInfo(updatedInfo);
      };
      syncProfileInfo();
    }
  }, [isUpdatingLabel]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    const profileInfo = await getProfileInfo();

    if (!profileInfo.browserId) {
        console.error('Browser ID not found. Extension needs to be reloaded.');
        setMessage('Browser ID not found. Please reload the extension.');
        setIsLoading(false);
        return;
    }

    console.log('Attempting login with profile info:', {
      email: email,
      profileUuid: profileInfo.profileUuid,
      profileLabel: profileInfo.profileLabel,
      browserId: profileInfo.browserId
    });

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Broswer-Id': profileInfo.browserId,
          'X-Profile-Uuid': profileInfo.profileUuid,
          'X-Profile-Label': profileInfo.profileLabel || ''
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        await chrome.storage.local.set({ authToken: data.token });
        await chrome.storage.local.set({ username: data?.user?.name });
        setIsLoggedIn(true);
        setMessage('Login successful!');
        setUsername(data.user.name ?? null);
        
        console.log('Login successful for profile:', {
          profileUuid: profileInfo.profileUuid,
          profileLabel: profileInfo.profileLabel,
          user: data.user.name
        });
      } else {
        setIsLoggedIn(false);
        setMessage(data.error || 'Login failed. Please check your credentials.');
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      setMessage('Network error or API is down.');
      console.error('Login network error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      console.log("response(regsitser)"+JSON.stringify(response));

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful! You can now log in.');
        setCurrentView('login');
      } else {
        setMessage(data.error || 'Registration failed. User may already exist.');
      }
    } catch (error) {
      setMessage('Network error or API is down.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setMessage('Logging out...');

      // Get authentication token and profile info
      const { authToken } = await chrome.storage.local.get(['authToken']);
      const profileInfo = await getProfileInfo();

      if (authToken && profileInfo.browserId && profileInfo.profileUuid) {
        try {
          // Call backend logout API to remove browser data from MongoDB
          const response = await fetch(logoutUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
              'X-Broswer-Id': profileInfo.browserId,
              'X-Profile-Uuid': profileInfo.profileUuid
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Logout API successful:', data);
            setMessage('Logged out successfully. Browser data removed.');
          } else {
            const errorData = await response.json();
            console.error('Logout API failed:', errorData);
            setMessage('Logout completed, but server cleanup may have failed.');
          }
        } catch (apiError) {
          console.error('Logout API network error:', apiError);
          setMessage('Logout completed, but server cleanup failed due to network error.');
        }
      } else {
        console.warn('Missing authentication data for logout API call');
        setMessage('Logged out locally.');
      }

      // Always clear local storage regardless of API result
      await chrome.storage.local.remove(['authToken']);
      await chrome.storage.local.remove(['username']);
      
      // Update UI state
      setIsLoggedIn(false);
      setUsername(null);
      setCurrentView('login');
      
      console.log('Local logout completed for profile:', profileInfo.profileUuid);
      
      // Clear the loading message after a short delay
      setTimeout(() => {
        if (!isLoggedIn) {
          setMessage('');
        }
      }, 3000);

    } catch (error) {
      console.error('Logout process failed:', error);
      setMessage('Logout failed due to an unexpected error.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center p-6 bg-gray-200 min-w-[320px] min-h-[480px]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>
      {isLoggedIn ? (
        <AuthenticatedView
          username={username}
          profileInfo={profileInfo}
          profileLabelInput={profileLabelInput}
          setProfileLabelInput={setProfileLabelInput}
          isUpdatingLabel={isUpdatingLabel}
          updateProfileLabel={updateProfileLabel}
          handleLogout={handleLogout}
          profileLabelInputRef={profileLabelInputRef}
          isLoading={isLoading}
        />
      ) : (
        currentView === 'login' ? (
          <LoginForm
            message={message}
            handleLogin={handleLogin}
            isLoading={isLoading}
            profileInfo={profileInfo}
            setCurrentView={setCurrentView}
          />
        ) : (
          <RegisterForm
            message={message}
            handleRegister={handleRegister}
            isLoading={isLoading}
            setCurrentView={setCurrentView}
          />
        )
      )}
    </div>
  );
};

export default App;
