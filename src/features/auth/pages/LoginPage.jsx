import { useEffect, useState } from 'react';
import { login } from '../api/authApi';
import { useUserStore } from '../../../store/userStore';
import { useNavigate, Link } from 'react-router-dom';
import { getDeviceUUID } from '../../../lib/deviceUUID';


export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.error("LoginPage token:", token);
    if (token) {
      // navigate('/gardens');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(form);
      setUser(data.data.user, data.data.accessToken, data.data.refreshToken);
      getDeviceUUID();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-80">
          <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
          <button className="w-full bg-green-800 text-white py-2 rounded">Login</button>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </form>
        <Link to="/signin" className="text-sm text-blue-500 underline">Sign up</Link>
      </div>
    </>
  )
}