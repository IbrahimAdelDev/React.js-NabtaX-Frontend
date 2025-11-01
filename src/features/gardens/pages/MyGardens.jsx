import { useEffect, useState } from 'react';
import { getMyGardens } from '../api/gardensApi';
import { useNavigate } from 'react-router-dom';

export default function MyGardens() {
  const navigate = useNavigate();
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchGardens = async () => {
      try {
        const { data } = await getMyGardens();
        setGardens(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load gardens');
      } finally {
        setLoading(false);
      }
    };

    fetchGardens();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <h1 className="text-2xl font-bold text-green-900 mb-6 text-center">
        My Gardens
      </h1>

      {gardens.length === 0 ? (
        <p className="text-center text-gray-500">No gardens found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gardens.map((garden, index) => (
            <div
              key={garden._id}
              onClick={() => navigate(`/gardens/${garden._id}`)}
              className="cursor-pointer bg-white shadow-md p-4 rounded-xl border border-gray-200 hover:shadow-lg transition hover:bg-green-50"
            >
              <h2 className="text-lg font-semibold text-green-800">
                #{index + 1} — {garden.name}
              </h2>
              <p className="text-gray-600 mt-1">
                {garden.location?.city}, {garden.location?.address}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Created: {new Date(garden.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* الزر الدائري */}
      <button
        onClick={() => navigate('/gardens/add')}
        className="fixed bottom-6 right-6 bg-green-800 text-white w-14 h-14 rounded-full text-3xl flex items-center justify-center shadow-lg hover:bg-green-700"
      >
        +
      </button>
    </div>
  );
}
