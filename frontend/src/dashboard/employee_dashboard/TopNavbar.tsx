import api from '../../api/axios';

type Props = {
  onLogout: () => void;
};

const TopNavbar = ({ onLogout }: Props) => {
  const userStr = localStorage.getItem('loggedInUser');
  const user = userStr ? JSON.parse(userStr) : null;
  const companyName = user?.company_Hostname || '';
  const ownerName = user?.name || '';

  const handleLogout = async () => {
    try {
      await api.post('/user/logout'); 
    } catch (err: unknown) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('loggedInUser'); 
      onLogout();
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-lg">{companyName}</div>
      <div className="text-sm">Logged in as: {ownerName}</div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        LogOut
      </button>
    </header>
  );
};

export default TopNavbar;
