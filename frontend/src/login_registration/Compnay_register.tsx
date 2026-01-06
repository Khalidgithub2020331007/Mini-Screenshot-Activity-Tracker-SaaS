import { useEffect, useState } from 'react';
import type { CreateCompanyPayload } from '../types';
import api from '../api/axios';

type Plan = {
  id: number;
  name: string;
  price: number;
  numberOfPerson: number;
};

type Props = {
  goToPage?: (page: 'login' | 'companyRegister') => void;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

const CompanyRegister = ({ goToPage }: Props) => {
  const [company, setCompany] = useState<CreateCompanyPayload>({
    companyName: '',
    planId: 0,
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
  });

  const [plans, setPlans] = useState<Plan[]>([]);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {


    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await api.get('/plans_list');
        setPlans(res.data);
      } catch (err) {
        console.error('Failed to fetch plans', err);
      }
      finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleChange = (
    
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    
    const { name, value } = e.target;
    setLoginError('');

    setCompany((prev) => ({
      ...prev,
      [name]: name === 'planId' ? Number(value) : value,
    }));
  };

  const handleEmailChange = (value: string) => {
    setLoginError('');
    setCompany((prev) => ({ ...prev, ownerEmail: value }));
    setEmailError(emailRegex.test(value) ? '' : 'Invalid email address');
  };

  const handlePasswordChange = (value: string) => {
    setLoginError('');
    setCompany((prev) => ({ ...prev, ownerPassword: value }));
    setPasswordError(
      PASSWORD_REGEX.test(value)
        ? ''
        : 'Min 8 chars, upper, lower, number & symbol'
    );
  };

  const canSubmit =
    company.companyName &&
    company.ownerName &&
    company.ownerEmail &&
    company.ownerPassword &&
    company.planId > 0 &&
    !emailError &&
    !passwordError && loginError === '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    console.log(company)

    try {
      setLoading(true);
      await api.post('/create-company', company);
  
      goToPage?.('login');
    } catch (err) {
      console.log(err)
      alert('Something went wrong. Please try again.');
      setLoginError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Register Your Company
        </h2>

        {/* Company */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Company Name
          </label>
          <input
            name="companyName"
            value={company.companyName}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500"
            placeholder="Acme Inc."
          />
        </div>

        {/* Owner */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Owner Name
          </label>
          <input
            name="ownerName"
            value={company.ownerName}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Owner Email
          </label>
          <input
            type="email"
            value={company.ownerEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
            className="mt-1 w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500"
            placeholder="john@company.com"
          />
          {emailError && (
            <p className="text-xs text-red-500 mt-1">{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            value={company.ownerPassword}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="mt-1 w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          {passwordError && (
            <p className="text-xs text-red-500 mt-1">{passwordError}</p>
          )}
        </div>

        {/* Plans */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Choose Plan
          </label>
          <select
            name="planId"
            value={company.planId}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Select a plan</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} — ${plan.price} / month ({plan.numberOfPerson} seats)
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-3 rounded-xl font-semibold text-white transition ${
            canSubmit
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Creating Account...' : 'Create Company'}
        </button>

        {goToPage && (
          <p
            onClick={() => goToPage('login')}
            className="text-center text-sm text-blue-600 hover:underline cursor-pointer"
          >
            Already have an account? Login
          </p>
        )}
      </form>
    </div>
  );
};

export default CompanyRegister;
