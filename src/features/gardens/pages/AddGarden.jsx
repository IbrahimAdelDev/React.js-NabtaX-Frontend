import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGarden } from '../api/gardensApi';

export default function AddGardenPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  console.error('AddGardenPage user:', user.id);

  const [form, setForm] = useState({
    name: '',
    country: '',
    city: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setError('User not found. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ownerId: user.id,
        name: form.name,
        location: {
          country: form.country,
          city: form.city,
          address: form.address,
        },
      };
      await createGarden(payload);
      navigate('/gardens');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create garden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-green-800">
          Add New Garden
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Garden Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-800 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Saving...' : 'Save Garden'}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
