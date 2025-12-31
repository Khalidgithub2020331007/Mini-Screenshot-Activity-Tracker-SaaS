import React, { useState } from 'react';
import api from '../../api/axios';
import type { CreateEmployeePayload } from '../../types'

type Props = {
  onEmployeeCreated?: () => void; // Optional callback if you want to refresh employee list
};

const EmployeeRegister = ({ onEmployeeCreated }: Props) => {
  const [employee, setEmployee] = useState<CreateEmployeePayload>({
    name: '',
    email: '',
    password: '',
  });

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateEmployeePayload>>({});

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (name === 'email') {
      setEmailError(EMAIL_REGEX.test(value) ? '' : 'Invalid email format');
    }
    if (name === 'password') {
      setPasswordError(
        PASSWORD_REGEX.test(value)
          ? ''
          : 'Password must be 8+ chars, include uppercase, lowercase, number & special character'
      );
    }
  };

  const canSubmit =
    employee.name.trim() &&
    employee.email.trim() &&
    employee.password.trim() &&
    !emailError &&
    !passwordError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      await api.post('/create-employee', employee);
      alert('Employee created successfully!');

      // Reset form
      setEmployee({ name: '', email: '', password: '' });
      setErrors({});
      setEmailError('');
      setPasswordError('');

      // Optional callback to refresh employee list
      onEmployeeCreated?.();
    } catch (err:unknown) {
      console.error('Error:', err);
      // alert(err?.response?.data?.error || 'Failed to create employee');
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
          Register Employee
        </h2>

        <div className="flex flex-col space-y-4">
          <input
            name="name"
            placeholder="Employee Name"
            value={employee.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            name="email"
            type="email"
            placeholder="Employee Email"
            value={employee.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={employee.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full p-3 rounded text-white ${
            canSubmit ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Creating...' : 'Create Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeRegister;
