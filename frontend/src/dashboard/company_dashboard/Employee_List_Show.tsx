import { useCallback, useEffect, useState } from 'react';
import api from '../../api/axios';
import type { User } from '../../types';
import ScreenShot_Show from './ScreenShot_Show';

type Meta = {
  currentPage: number;
  firstPage: number;
  lastPage: number;
  totalPages: number;
  perPage: number;
};

const EmployeeListShow = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [meta, setMeta] = useState<Meta>({
    currentPage: 1,
    firstPage: 1,
    lastPage: 1,
    totalPages: 1,
    perPage: 10,
  });
  const [loading, setLoading] = useState(false);
  const [, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/employees_list', {
        params: { page, limit, name: searchQuery },
      });

      const responseData = res.data?.data;
      // console.log(responseData)
      if (!responseData) {
        setEmployees([]);
        setMeta({ currentPage: 1, firstPage: 1, lastPage: 1, totalPages: 0, perPage: limit });
        return;
      }
      setEmployees(responseData.data);
      const m = responseData.meta;
      setMeta({
        currentPage: m.currentPage,
        firstPage: m.firstPage,
        lastPage: m.lastPage,
        perPage: m.perPage,
        totalPages: Math.ceil(m.total / m.perPage),
      });
    } catch (err) {
      console.error('Failed to fetch employees', err);
      setEmployees([]);
      setMeta({ currentPage: 1, firstPage: 1, lastPage: 1, totalPages: 0, perPage: limit });
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]);

  // Debounced fetch
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchEmployees();
    }, 1000); // 1 second debounce
    return () => clearTimeout(debounce);
  }, [fetchEmployees]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handlePrev = () => { if (page > 1) setPage(prev => prev - 1); };
  const handleNext = () => { if (page < meta.totalPages) setPage(prev => prev + 1); };

  if (selectedUserId) {
    return <ScreenShot_Show userId={selectedUserId} onBack={() => setSelectedUserId(null)} />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-[70vh] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Employee List</h2>

      {/* Search */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Employee grid */}
      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading employees...</p>
      ) : employees.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No employees found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {employees.map(emp => (
            <li
              key={emp.id}
              className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedUserId(emp.id)}
            >
              <p className="text-lg font-semibold text-gray-700">{emp.name}</p>
              <p className="text-gray-500 text-sm">{emp.email}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Prev
          </button>
          <span className="px-4 py-2 rounded bg-gray-200 text-gray-700">
            Page {page} of {meta.totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === meta.totalPages}
            className={`px-4 py-2 rounded ${page === meta.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeListShow;
