import React, { useState } from "react";
import api from "../../../lib/api"; // ← نفس الطريقة اللي مستخدمها في باقي المشروع
import { useNavigate, useParams } from "react-router-dom";

const AddDevice = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { gardenId } = useParams();
  
  console.log('GardenDetails user:', gardenId);

  const [formData, setFormData] = useState({
    ownerId: user?.id || "",
    gardenId: gardenId || "",
    productId: "671b2b06c4f5df00236b0a90",
    serial: "",
    model: "",
    specifications: "",
    firmware: "",
    manufacturer: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🧩 handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚀 handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("devices", formData); 
      setMessage("✅ Device added successfully!");
      setTimeout(() => navigate("/gardens/" + gardenId + "/devices/" + res.data._id), 1000);
    } catch (err) {
      setMessage("❌ Failed to add device: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          ➕ Add New Device
        </h2>
        {/* productId */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Product ID</label>
          <input
            type="text"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter Product ObjectId"
          />
        </div>

        {/* serial */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Serial</label>
          <input
            type="text"
            name="serial"
            value={formData.serial}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="DEV-001"
          />
        </div>

        {/* model */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="model XYZ"
          />
        </div>

        {/* specifications */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Specifications</label>
          <textarea
            name="specifications"
            value={formData.specifications}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="ECG, PPG, GPS sensors..."
          />
        </div>

        {/* firmware */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Firmware Version</label>
          <input
            type="text"
            name="firmware"
            value={formData.firmware}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="v1.0.0"
          />
        </div>

        {/* manufacturer */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Manufacturer</label>
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="NabtaX"
          />
        </div>

        {/* status */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
            <option value="decommissioned">Decommissioned</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Adding..." : "Add Device"}
        </button>

        {message && (
          <p
            className={`text-center text-sm mt-2 ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddDevice;
