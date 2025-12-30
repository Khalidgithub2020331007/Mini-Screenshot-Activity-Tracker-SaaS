import React from 'react'

const compnay_register = () => {
  return (
    <div>
      
    </div>
  )
}

export default compnay_register

import { useState } from 'react';
import type { Company } from '../types';
import api from '../api/axios';


type Props = {
  goToPage?: (page: 'userRegister' | 'userLogin' | 'companyRegister') => void;
};
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const CompanyRegister = ({ goToPage }: Props) => {
  const [company, setCompany] = useState<Company>({
    company_name: '',
    hostname: '',
    owner_name: '',
    owner_email: '',
    owner_password: '',
  });

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const handleEmailChange = (value: string) => {
    setCompany(prev => ({ ...prev, owner_email: value }));
    // console.log('Email changed:', value);  
    if (!emailRegex.test(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };



  const handlePasswordChange = (value: string) => {
    setCompany(prev => ({ ...prev, owner_password: value }));
    if (!PASSWORD_REGEX.test(value)) {
      setPasswordError(
        'Password must be 8+ chars, include uppercase, lowercase, number & special character'
      );
    } else {
      setPasswordError('');
    }
  };

  const canSubmit =
    company.company_name.trim() !== '' &&
    company.hostname.trim() !== '' &&
    company.owner_name.trim() !== '' &&
    company.owner_email.trim() !== '' &&
    company.owner_password.trim() !== '' &&
    emailError === '' &&
    passwordError === '';

  const [errors, setErrors] = useState<Partial<Record<keyof Company, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany(prev => ({ ...prev, [e.target.name]: e.target.value }));

    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (!canSubmit) return;
    setErrors({});


    try {
      setLoading(true);
       await api.post('/company/register', company);

      

      if (goToPage) goToPage('userLogin');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Network error or server is down');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Company Registration
        </h2>

        <div className="flex flex-col space-y-4">
          <input
            name="company_name"
            placeholder="Company Name"
            value={company.company_name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {errors.company_name && <p className="text-red-500 text-sm">{errors.company_name}</p>}

          <input
            name="hostname"
            placeholder="Hostname"
            value={company.hostname}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {errors.hostname && <p className="text-red-500 text-sm">{errors.hostname}</p>}

          <input
            name="owner_name"
            placeholder="Owner Name"
            value={company.owner_name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {errors.owner_name && <p className="text-red-500 text-sm">{errors.owner_name}</p>}

          <input
            name="owner_email"
            type="email"
            placeholder="Owner Email"
            value={company.owner_email}
            onChange={e=> handleEmailChange(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

          <input
            name="owner_password"
            type="password"
            placeholder="Owner Password"
            value={company.owner_password}
            onChange={e=>handlePasswordChange(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full p-3 rounded text-white ${
            canSubmit
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Registering...' : 'Register Company'}
        </button>

        {goToPage && (
          <div className="flex justify-between text-sm text-blue-500 mt-4">
            <span className="cursor-pointer hover:underline" onClick={() => goToPage('userRegister')}>
              Go to User Register
            </span>
            <span className="cursor-pointer hover:underline" onClick={() => goToPage('userLogin')}>
              Go to User Login
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default CompanyRegister;
