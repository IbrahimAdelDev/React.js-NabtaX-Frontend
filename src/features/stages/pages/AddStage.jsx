import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../lib/api";

const AddStage = () => {
  const navigate = useNavigate();
  const { gardenId, deviceId } = useParams(); 
  console.log('AddStage deviceId:', deviceId);
  console.log('AddStage gardenId:', gardenId);

  const [formData, setFormData] = useState({
    gardenId: gardenId ||"",
    deviceId: deviceId || "",
    name: "",
    type: "grow_bed",
    status: "active",
    level: 1,
    maxPlants: 10,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("stages", formData);
      console.log('Stage created:', res.data);
      setMessage("✅ Stage created successfully!");
      setTimeout(() => navigate(`/gardens/${gardenId}/devices/${deviceId}/stages/${res.data._id}`), 1500);
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || err.message));
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
          ➕ Add New Stage
        </h2>

        {/* gardenId */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Garden ID</label>
          <input
            type="text"
            name="gardenId"
            value={formData.gardenId}
            onChange={handleChange}
            required
            placeholder="Enter Garden ObjectId"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* name */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Grow Bed 1"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* type */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="grow_bed">Grow Bed</option>
            <option value="water_tank">Water Tank</option>
            <option value="nutrient_tank">Nutrient Tank</option>
          </select>
        </div>

        {/* level */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Level</label>
          <input
            type="number"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* maxPlants */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Max Plants</label>
          <input
            type="number"
            name="maxPlants"
            value={formData.maxPlants}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Creating..." : "Create Stage"}
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

export default AddStage;
