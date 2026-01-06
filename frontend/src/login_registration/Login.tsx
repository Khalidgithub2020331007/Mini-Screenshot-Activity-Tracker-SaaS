import { useState } from 'react';
import api from '../api/axios';

type LoginProps = {
  setname: React.Dispatch<React.SetStateAction<string>>;
  goToPage?: (
    page: 'login' | 'companyRegister' | 'employeeDashboard' | 'ownerDashboard'
  ) => void;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Login: React.FC<LoginProps> = ({ setname, goToPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setLoginError('');

    if (!emailRegex.test(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setLoginError('');

    if (!strongPasswordRegex.test(value)) {
      setPasswordError(
        'Password must be 8+ chars, include uppercase, lowercase, number & special character'
      );
    } else {
      setPasswordError('');
    }
  };

  const canSubmit =
    email !== '' &&
    password !== '' &&
    emailError === '' &&
    passwordError === '' &&
    loginError === '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post('/login', { email, password });
      const backendUser = res.data.user;
      setname(backendUser.name);

      if (goToPage) {
        goToPage(
          backendUser.role === 'owner'
            ? 'ownerDashboard'
            : 'employeeDashboard'
        );
      }
    } catch {
      setLoginError('Invalid email or password');
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto p-4 space-y-4 bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-bold text-center">User Login</h2>

      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => handleEmailChange(e.target.value)}
          className={`border p-2 w-full rounded ${
            emailError ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {emailError && (
          <p className="text-red-500 text-sm mt-1">{emailError}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => handlePasswordChange(e.target.value)}
          className={`border p-2 w-full rounded ${
            passwordError ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}
      </div>

      {loginError && (
        <p className="text-red-500 text-sm text-center">{loginError}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full p-3 rounded text-white ${
          canSubmit
            ? 'bg-purple-500 hover:bg-purple-600'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Login
      </button>

      {goToPage && (
        <div className="flex justify-between text-blue-500 text-sm mt-2">
          <span
            className="cursor-pointer"
            onClick={() => goToPage('companyRegister')}
          >
            Go to Company Register
          </span>
        </div>
      )}
    </form>
  );
};

export default Login;
