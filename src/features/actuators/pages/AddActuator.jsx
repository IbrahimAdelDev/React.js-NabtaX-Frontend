import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../lib/api";

const AddActuator = () => {
  const navigate = useNavigate();
  const { gardenId, deviceId, stageId } = useParams();

  const [formData, setFormData] = useState({
    deviceId: deviceId || "",
    stageId: stageId || "",
    name: "",
    type: "pump",
    state: "off",
    value: 0,
    capabilities: {},
    schedule: {
      mode: "auto",
      start: "07:00",
      end: "19:00",
      days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      timezone: "Africa/Cairo",
    },
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔧 handle input (عادي)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔧 handle schedule input
  const handleScheduleChange = (key, value) => {
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [key]: value,
      },
    });
  };

  // 💾 handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("actuators", formData);
      setMessage("✅ Actuator and schedule created successfully!");
      setTimeout(() => {
        navigate(`/gardens/${gardenId}/devices/${deviceId}/stages/${stageId}`);
      }, 1500);
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 🌍 toggle days of week
  const toggleDay = (day) => {
    const days = formData.schedule.days.includes(day)
      ? formData.schedule.days.filter((d) => d !== day)
      : [...formData.schedule.days, day];
    handleScheduleChange("days", days);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          ➕ Add New Actuator
        </h2>

        {/* name */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Pump 1"
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
            <option value="pump">Pump</option>
            <option value="valve">Valve</option>
            <option value="heater">Heater</option>
            <option value="cooler">Cooler</option>
            <option value="led">LED</option>
          </select>
        </div>

        {/* value */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Initial Value</label>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* state */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Initial State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="off">Off</option>
            <option value="on">On</option>
            <option value="error">Error</option>
          </select>
        </div>

        {/* ⚙️ Schedule Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🕒 Schedule</h3>

          <div>
            <label className="block mb-1 font-medium text-gray-600">Mode</label>
            <select
              value={formData.schedule.mode}
              onChange={(e) => handleScheduleChange("mode", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="auto">Auto</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block mb-1 font-medium text-gray-600">Start</label>
              <input
                type="time"
                value={formData.schedule.start}
                onChange={(e) => handleScheduleChange("start", e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">End</label>
              <input
                type="time"
                value={formData.schedule.end}
                onChange={(e) => handleScheduleChange("end", e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Days selector */}
          <div className="mt-3">
            <label className="block mb-1 font-medium text-gray-600">Days Active</label>
            <div className="grid grid-cols-7 gap-1">
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`rounded-md px-2 py-1 text-xs font-medium ${
                    formData.schedule.days.includes(day)
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {day.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* timezone */}
          <div className="mt-3">
            <label className="block mb-1 font-medium text-gray-600">Timezone</label>
            <input
              type="text"
              value={formData.schedule.timezone}
              onChange={(e) => handleScheduleChange("timezone", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Adding..." : "Add Actuator"}
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

export default AddActuator;
