import { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { User } from '../../types';
import ScreenShot_Show from './ScreenShot_Show';
import { Trash2 } from 'lucide-react';

type Meta = {
  currentPage: number;
  firstPage: number;
  lastPage: number;
  totalPages: number;
  perPage: number;
  total: number;
};

const EmployeeListShow = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [meta, setMeta] = useState<Meta>({
    currentPage: 1,
    firstPage: 1,
    lastPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
  });

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees_list', {
        params: { page, limit, name: searchQuery },
      });

      const responseData = res.data?.data;
      if (!responseData) {
        setEmployees([]);
        setMeta({ currentPage: 1, firstPage: 1, lastPage: 1, totalPages: 0, perPage: limit, total: 0 });
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
        total: m.total,
      });
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchEmployees, 200);
    return () => clearTimeout(debounce);
  }, [page, limit, searchQuery]);

  const confirmDelete = async () => {
    if (!deleteUserId) return;

    setDeleting(true);
    try {
      await api.delete('/delete-employee', { params: { employeeId: deleteUserId } });
      setDeleteUserId(null);
      fetchEmployees();
    } catch {
      alert('Failed to delete employee');
    } finally {
      setDeleting(false);
    }
  };

  if (selectedUserId) {
    return <ScreenShot_Show userId={selectedUserId} onBack={() => setSelectedUserId(null)} />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-[70vh] rounded-lg shadow">
      {/* Title + Total Employees Badge */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Employee List
        </h2>

        <div className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 text-blue-700 font-medium shadow-sm">
          <span className="text-sm uppercase tracking-wide">Total Employees</span>
          <span className="text-lg font-bold">
            {meta.total>0?meta.total: 0}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6 flex justify-center">
        <input
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search employee..."
          className="w-full max-w-sm px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Employee List */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading...</p>
      ) : employees.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No employees found</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map(emp => (
            <li
              key={emp.id}
              onClick={() => setSelectedUserId(emp.id)}
              className="relative bg-white rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer group"
            >
              <p className="text-lg font-semibold text-gray-800">{emp.name}</p>
              <p className="text-sm text-gray-500">{emp.email}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteUserId(emp.id);
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition opacity-0 group-hover:opacity-100"
                title="Delete employee"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-3">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2 bg-gray-100 rounded">
            {page} / {meta.totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === meta.totalPages}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Delete Employee
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this employee? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteUserId(null)}
                disabled={deleting}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeListShow;
