import api from '../../api/axios';

type Props = {
  onLogout: () => void;
  name:string
};

const TopNavbar: React.FC<Props> = ({ onLogout,name }) => {
  

  const handleLogout = async () => {
    try {
      await api.post('/logout'); 
    } catch (err: unknown) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('token'); 
      delete api.defaults.headers.common['Authorization'];
      onLogout();
    }
  };
    

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div className="text-sm">Employee: <b>{name}</b></div>
          
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
