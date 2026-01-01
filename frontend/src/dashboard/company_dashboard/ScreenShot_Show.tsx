import { useEffect, useState } from 'react';
import api from '../../api/axios';

export type Screenshot = {
  id: number;
  name: string;
  url: string;
  type: string;
  created_at: string;
};

type Interval = {
  interval: string; // e.g., "04:10"
  screenshots: Screenshot[];
};

type HourData = {
  hour: number;
  intervals: Interval[];
};

type Props = {
  userId: number;
  onBack: () => void;
};

const ScreenShot_Show = ({ userId, onBack }: Props) => {
  const [groupedScreenshots, setGroupedScreenshots] = useState<HourData[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [groupBy, setGroupBy] = useState<'5min' | '10min'|'20min'>('10min');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<Screenshot | null>(null);

  const fetchScreenshots = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const res = await api.post('/owner-query', { userId, date, groupBy });
      const data = res.data?.[date];

      if (!data) {
        setGroupedScreenshots([]);
        return;
      }

      // Transform backend data into HourData[]
      const grouped: HourData[] = [];

      Object.entries(data).forEach(([timeKey, shots]: [string, any[]]) => {
        const hour = parseInt(timeKey.split(':')[0], 10);

        const intervalObj: Interval = {
          interval: timeKey,
          screenshots: shots.map((shot: any) => ({
            id: shot.id,
            name: shot.name,
            url: shot.path,
            type: shot.type,
            created_at: shot.createdAt,
          })),
        };

        const existingHour = grouped.find((h) => h.hour === hour);
        if (existingHour) {
          existingHour.intervals.push(intervalObj);
        } else {
          grouped.push({ hour, intervals: [intervalObj] });
        }
      });

      // Sort hours and intervals
      grouped.sort((a, b) => a.hour - b.hour);
      grouped.forEach((h) =>
        h.intervals.sort(
          (a, b) => parseInt(a.interval.split(':')[1], 10) - parseInt(b.interval.split(':')[1], 10)
        )
      );

      setGroupedScreenshots(grouped);
    } catch (err) {
      console.error('Failed to fetch screenshots', err);
      setGroupedScreenshots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreenshots();
  }, [userId, date, groupBy]);

  const openModal = (shot: Screenshot) => {
    setModalImage(shot);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-[70vh] rounded-lg shadow-md relative">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back
      </button>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-4">
        <p className="font-semibold text-gray-700">Select Date:</p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded p-2"
        />

        <p className="font-semibold text-gray-700">Group By:</p>
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as '5min' | '10min' | '20min')}
          className="border border-gray-300 rounded p-2"
        >
          <option value="5min">5 Minutes</option>
          <option value="10min">10 Minutes</option>
          {/* <option value="20min">20 Minutes</option> */}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading screenshots...</p>
      ) : groupedScreenshots.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No screenshots found for this date.</p>
      ) : (
        groupedScreenshots.map((hourData) => (
          <div key={hourData.hour} className="mb-6">
            <div className="bg-gray-200 px-3 py-2 rounded flex justify-between items-center">
              <h2 className="font-bold text-gray-700">Hour: {hourData.hour}.00</h2>
            </div>

            <div className="mt-2 space-y-4">
              {hourData.intervals.map((interval) => (
                <div key={interval.interval}>
                  <p className="text-xs font-semibold text-gray-600 mb-1">{interval.interval}</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {interval.screenshots.length > 0 ? (
                      interval.screenshots.map((shot) => (
                        <div
                          key={shot.id}
                          className="flex-shrink-0 w-32 cursor-pointer"
                          onClick={() => openModal(shot)}
                        >
                          <img
                            src={shot.url}
                            alt={shot.name}
                            className="w-full h-24 object-cover rounded hover:opacity-90 transition"
                          />
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            {new Date(shot.created_at).toLocaleTimeString('en-US', {
                              timeZone: 'Asia/Dhaka',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true,
                            })}
                          </p>
                          
                        </div>
                      ))
                    ) : (
                      <div className="flex-shrink-0 w-32 h-24 flex items-center justify-center border rounded text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Full-screen Modal */}
      {modalOpen && modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-2 rounded max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage.url}
              alt={modalImage.name}
              className="max-w-[80vw] max-h-[80vh] object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenShot_Show;
