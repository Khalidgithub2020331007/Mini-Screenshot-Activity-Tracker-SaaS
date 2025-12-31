import { useEffect, useState } from 'react';
import api from '../../api/axios';

export type Screenshot = {
  id: number;
  name: string;
  url: string;
  type: string;
  created_at: string;
};

type Props = {
  userId: number;
  onBack: () => void;
};

const ScreenShot_Show = ({ userId, onBack }: Props) => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const fetchScreenshots = async () => {
    setLoading(true);
    try {
      // date is already a string in YYYY-MM-DD format
      const res = await api.post('/owner-query', {
        userId,
        date,
        groupBy: '10min',
      });

      const data = res.data?.data;
      console.log(data,date,userId)
      // Flatten nested objects to array
      const screenshotsArray: Screenshot[] = Array.isArray(data) ? data : Object.values(data).flat();
      setScreenshots(screenshotsArray);
    } catch (err) {
      console.error('Failed to fetch screenshots', err);
      setScreenshots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreenshots();
  }, [userId, date]);

  return (
    <div className="p-6 bg-gray-50 min-h-[70vh] rounded-lg shadow-md">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back
      </button>

      <div className="flex items-center gap-4 mb-4">
        <p className="font-semibold text-gray-700">Select Date:</p>
        <input
          type="date"
          value={date} // use the string directly
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded p-2"
        />
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading screenshots...</p>
      ) : screenshots.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No screenshots found for this date.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {screenshots.map((shot) => (
            <div
              key={shot.id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white"
            >
              <img src={shot.url} alt={shot.name} className="w-full h-48 object-cover" />
              <div className="p-2">
                <p className="text-sm text-gray-600">
                  {new Date(shot.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScreenShot_Show;
