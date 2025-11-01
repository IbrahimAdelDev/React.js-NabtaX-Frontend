import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../lib/api";

const AddSensor = () => {
  const navigate = useNavigate();
  const { gardenId, deviceId, stageId } = useParams();

  const [formData, setFormData] = useState({
    deviceId: deviceId || "",
    stageId: stageId || "",
    type: "temp",
    unit: "C",
    calibration: {
      offset: 0,
      scale: 1,
    },
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔧 handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ⚙️ handle calibration fields
  const handleCalibrationChange = (key, value) => {
    setFormData({
      ...formData,
      calibration: {
        ...formData.calibration,
        [key]: Number(value),
      },
    });
  };

  // 💾 handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("sensors", formData);
      setMessage("✅ Sensor added successfully!");
      setTimeout(() => {
        navigate(`/gardens/${gardenId}/devices/${deviceId}/stages/${stageId}`);
      }, 1500);
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
          ➕ Add New Sensor
        </h2>

        {/* 🔹 Type */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Sensor Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="temp">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="ph">pH</option>
            <option value="ec">EC (Electrical Conductivity)</option>
          </select>
        </div>

        {/* 🔹 Unit */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Unit</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="C">°C</option>
            <option value="F">°F</option>
            <option value="%">%</option>
            <option value="pH">pH</option>
            <option value="mS/cm">mS/cm</option>
          </select>
        </div>

        {/* 🔹 Calibration Settings */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">⚙️ Calibration</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-medium text-gray-600">Offset</label>
              <input
                type="number"
                value={formData.calibration.offset}
                onChange={(e) => handleCalibrationChange("offset", e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">Scale</label>
              <input
                type="number"
                step="0.1"
                value={formData.calibration.scale}
                onChange={(e) => handleCalibrationChange("scale", e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* 🔘 Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Adding..." : "Add Sensor"}
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

export default AddSensor;
