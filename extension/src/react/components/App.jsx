import React, { useState, useEffect } from 'react';

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('login');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const loginUrl = `${API_URL}/auth/login`;
  const registerUrl = `${API_URL}/auth/register`;
  const profileUrl = `${API_URL}/auth/profile`;

  const getBroswerId = async () => {
    const result = await chrome.storage.local.get("broswerId");
    return result.broswerId;
  }

  useEffect(() => {
    const checkToken = async () => {
      try {
        const result = await chrome.storage.local.get(['authToken']);
        if (result.authToken) {
          const userResult = await chrome.storage.local.get(['username']);
          const username = userResult.username;
          setIsLoggedIn(true);
          setMessage('Welcome back!');
          setUsername(username ?? '-');
        } else {
          setIsLoggedIn(false);
          setUsername(null);
        }
      } catch (error) {
        console.error('Failed to get token from storage:', error);
      }
    };
    checkToken();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    const email = event.target.email.value;
    const password = event.target.password.value;
    const broswerId = await getBroswerId();

    if (!broswerId) {
        console.error('Browser ID not found. Please reload the extension.');
        return;
    }

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Broswer-Id': broswerId
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
      } else {
        setIsLoggedIn(false);
        setMessage(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setMessage('Network error or API is down.');
      console.error('Login error:', error);
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
      // Remove the token from storage
      await chrome.storage.local.remove(['authToken']);
      await chrome.storage.local.remove(['username']);
      setIsLoggedIn(false);
      setMessage('You have been logged out.');
      setUsername(null);
      setCurrentView('login'); // Reset view to login form
    } catch (error) {
      console.error('Failed to remove token:', error);
      setMessage('Logout failed.');
    }
  };

  const AuthenticatedView = () => (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800">Welcome {username}!</h2>
      <p className="mt-2 text-gray-600">You are successfully logged in.</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  );

  const LoginForm = () => (
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

  const RegisterForm = () => (
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
      <script src="https://cdn.tailwindcss.com"></script>
      {isLoggedIn ? <AuthenticatedView /> : (currentView === 'login' ? <LoginForm /> : <RegisterForm />)}
    </div>
  );
};

export default App;
