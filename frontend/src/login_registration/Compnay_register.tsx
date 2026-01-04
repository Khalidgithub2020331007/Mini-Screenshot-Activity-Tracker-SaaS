

import { useState } from 'react';
import type { CreateCompanyPayload } from '../types';
import api from '../api/axios';


type Props = {
  goToPage?: (page: 'login' | 'companyRegister') => void;
};
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const CompanyRegister = ({ goToPage }: Props) => {
  const [company, setCompany] = useState<CreateCompanyPayload>({
    companyName:'',
    plan: 'basic',
    ownerName: '',
    ownerEmail:'',
    ownerPassword: ''
  });

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const handleEmailChange = (value: string) => {
    setCompany(prev => ({ ...prev, ownerEmail: value }));
    // console.log('Email changed:', value);  
    if (!emailRegex.test(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };



  const handlePasswordChange = (value: string) => {
    setCompany(prev => ({ ...prev, ownerPassword: value }));
    if (!PASSWORD_REGEX.test(value)) {
      setPasswordError(
        'Password must be 8+ chars, include uppercase, lowercase, number & special character'
      );
    } else {
      setPasswordError('');
    }
  };

  const canSubmit =
    company.companyName.trim() !== '' &&
    company.ownerName.trim() !== '' &&
    company.ownerEmail.trim() !== '' &&
    company.ownerPassword.trim() !== '' &&
    emailError === '' &&
    passwordError === '';

  const [errors, setErrors] = useState<Partial<Record<keyof CreateCompanyPayload, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setCompany(prev => ({
      ...prev,
      [name]: value,
    }));

    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (!canSubmit) return;
    setErrors({});


    try {
      setLoading(true);
       await api.post('/create-company', company);
      if (goToPage) goToPage('login');
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
            name="companyName"
            placeholder="Company Name"
            value={company.companyName}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}

       
          <input
            name="ownerName"
            placeholder="Owner Name"
            value={company.ownerName}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName}</p>}

          <input
            name="ownerEmail"
            type="email"
            placeholder="Owner Email"
            value={company.ownerEmail}
            onChange={e=> handleEmailChange(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

          <input
            name="ownerPassword"
            type="password"
            placeholder="Owner Password"
            value={company.ownerPassword}
            onChange={e=>handlePasswordChange(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          <select
            name="plan"
            value={company.plan}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="basic">Basic($5 2seat/month)</option>
            <option value="pro">Pro($10 5seat/month)</option>
            <option value="enterprise">Enterprise($20 10seat/month)</option>
          </select>
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
            
            <span className="cursor-pointer hover:underline" onClick={() => goToPage('login')}>
              Go to User Login
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default CompanyRegister;
