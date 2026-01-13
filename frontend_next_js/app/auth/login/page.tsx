'use client'

import { useState } from 'react';
import api from '@/app/api/axios';
import { useRouter } from 'next/navigation'


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const router= useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [disableButton, setDisableButton] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setLoginError('');
    setDisableButton(false);

    if (!emailRegex.test(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setLoginError('');
    setDisableButton(false);
  };

  const canSubmit =
    email !== '' &&
    password !== '' &&
    emailError === '' &&
    loginError === '' &&
    !disableButton;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      const res = await api.post('/login', { email, password });
      const backendUser = res.data.user;
      if (backendUser.role === 'owner') {
        router.push('/dashboard/owner/employee_create')
      }
      else router.push('/dashboard/employee/upload_screenshot')
    } catch {
      setLoginError('Invalid email or password');
      setDisableButton(true);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto p-8 space-y-6 bg-white shadow-xl rounded-2xl"
    >
      <h2 className="text-3xl font-extrabold text-center text-gray-800">
        User Login
      </h2>

      <div className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => handleEmailChange(e.target.value)}
            className={`border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition ${
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
            className={`border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition`}
          />
        </div>
      </div>

      {loginError && (
        <p className="text-red-500 text-sm text-center">{loginError}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full p-3 rounded-lg text-white font-semibold transition ${
          canSubmit
            ? 'bg-purple-500 hover:bg-purple-600'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Login
      </button>

      {/* {goToPage && (
        <div className="flex justify-center text-sm mt-4">
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => goToPage('companyRegister')}
          >
            Go to Company Register
          </span>
        </div>
      )} */}
    </form>
  );
};

export default Login;
