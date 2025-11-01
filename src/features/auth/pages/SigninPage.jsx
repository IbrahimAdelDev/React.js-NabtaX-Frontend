import { useState, useEffect } from 'react';
import { signin } from '../api/authApi';
import { useNavigate, Link } from 'react-router-dom';

export default function SigninPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState("");

  useEffect(() => {
      const token = localStorage.getItem('token');
      console.error("LoginPage token:", token);
      if (token) {
        navigate('/gardens');
      }
    }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signin(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-80">
          <h2 className="text-xl font-bold mb-4 text-center">Sign up</h2>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
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
          <button className="w-full bg-green-800 text-white py-2 rounded">register</button>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </form>
        <Link to="/" className="text-sm text-blue-500 underline">Login</Link>
      </div>
    </>
  )
}