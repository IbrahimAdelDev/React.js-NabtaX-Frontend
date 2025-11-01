import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getGardenById,
  addEngineer,
  removeEngineer,
  addWorker,
  removeWorker,
} from '../api/gardensApi';
import { searchUsers } from '../api/gardensApi';

export default function GardenDetails() {
  const { gardenId } = useParams();
  const navigate = useNavigate();
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchRole, setSearchRole] = useState(''); // engineer | worker

  console.log(garden);

  useEffect(() => {
    const fetchGarden = async () => {
      try {
        const { data } = await getGardenById(gardenId);
        setGarden(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load garden');
      } finally {
        setLoading(false);
      }
    };
    fetchGarden();
  }, [gardenId]);

  const handleSearch = async (value) => {
    setSearch(value);
    if (value.length < 2) return setSearchResults(null);
    const { data } = await searchUsers(value);
    setSearchResults(data.data[0]);
  };

  const refreshGarden = async () => {
    const { data } = await getGardenById(gardenId);
    setGarden(data);
  };

  const handleAddEngineer = async (userId) => {
    await addEngineer(gardenId, userId);
    await refreshGarden();
    closeSearch();
  };

  const handleAddWorker = async (userId) => {
    await addWorker(gardenId, userId);
    await refreshGarden();
    closeSearch();
  };

  const handleRemoveEngineer = async (userId) => {
    await removeEngineer(gardenId, userId);
    await refreshGarden();
  };

  const handleRemoveWorker = async (userId) => {
    await removeWorker(gardenId, userId);
    await refreshGarden();
  };

  const openSearch = (role) => {
    setSearchRole(role);
    setShowSearch(true);
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearch('');
    setSearchResults(null);
    setSearchRole('');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <button
        onClick={() => navigate(-1)}
        className="text-green-800 underline mb-4"
      >
        ← Back
      </button>

      {/* Garden Info */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 mb-8">
        <h1 className="text-3xl font-bold text-green-900 mb-2">
          {garden.name}
        </h1>
        <p className="text-gray-700">
          📍 {garden.location?.city}, {garden.location?.address}
        </p>
        <p className="text-gray-400 mt-2">
          Created: {new Date(garden.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Engineers */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-green-800">Engineers</h2>
          <button
            onClick={() => openSearch('engineer')}
            className="bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-600"
          >
            + Add
          </button>
        </div>
        {garden.engineers?.length > 0 ? (
          <ul className="space-y-2">
            {garden.engineers.map((e) => (
              <li
                key={e._id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
              >
                <span
                  onClick={() => navigate(`/users/${e._id}`)}
                  className="cursor-pointer text-green-700 font-medium"
                >
                  {e.name}
                </span>
                <button
                  onClick={() => handleRemoveEngineer(e._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No engineers yet.</p>
        )}
      </div>

      {/* Workers */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-green-800">Workers</h2>
          <button
            onClick={() => openSearch('worker')}
            className="bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-600"
          >
            + Add
          </button>
        </div>
        {garden.workers?.length > 0 ? (
          <ul className="space-y-2">
            {garden.workers.map((w) => (
              <li
                key={w._id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
              >
                <span
                  onClick={() => navigate(`/users/${w._id}`)}
                  className="cursor-pointer text-green-700 font-medium"
                >
                  {w.name}
                </span>
                <button
                  onClick={() => handleRemoveWorker(w._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No workers yet.</p>
        )}
      </div>

      {/* Devices */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-green-800">Devices</h2>
          <button
            onClick={() => navigate(`/gardens/${gardenId}/devices/add`)}
            className="bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-600"
          >
            + Add
          </button>
        </div>

        {garden.devices?.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {garden.devices.map((device) => (
              <li
                key={device._id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-green-800">
                    {device.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {device.type || 'Unknown Type'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  ID: <span className="font-mono">{device._id}</span>
                </p>

                {device.status && (
                  <p className="text-sm">
                    Status:{' '}
                    <span
                      className={`font-medium ${
                        device.status === 'active'
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {device.status}
                    </span>
                  </p>
                )}

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => navigate(`/gardens/${gardenId}/devices/${device._id}`)}
                    className="text-green-700 hover:underline text-sm"
                  >
                    View Details →
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No devices yet.</p>
        )}
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-3">
              Add {searchRole === 'engineer' ? 'Engineer' : 'Worker'}
            </h3>
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Type a name..."
              className="border p-2 rounded-md w-full mb-3"
            />
            {searchResults && (
              <div className="p-3 bg-gray-100 rounded-lg mb-2">
                <p className="font-semibold">{searchResults.name}</p>
                <p className="text-sm text-gray-600">{searchResults.email}</p>
                <button
                  onClick={() =>
                    searchRole === 'engineer'
                      ? handleAddEngineer(searchResults._id)
                      : handleAddWorker(searchResults._id)
                  }
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            )}
            <button
              onClick={closeSearch}
              className="mt-4 text-gray-600 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
