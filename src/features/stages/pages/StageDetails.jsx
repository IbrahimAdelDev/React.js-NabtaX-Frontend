import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../lib/api";

const StageDetails = () => {
  const navigate = useNavigate();
  const { gardenId, deviceId, stageId } = useParams(); // /stages/:stageId

  const [stage, setStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log(stage);

  // ⚙️ تحميل بيانات الستيدج
  useEffect(() => {
    const fetchStage = async () => {
      try {
        const res = await api.get(`stages/${stageId}`);
        setStage(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load stage details");
      } finally {
        setLoading(false);
      }
    };
    fetchStage();
  }, [stageId]);

  // 🚀 أزرار التنقل
  const handleAddSensor = () => navigate(`/gardens/${gardenId}/devices/${deviceId}/stages/${stageId}/sensors/add`);
  const handleAddActuator = () => navigate(`/gardens/${gardenId}/devices/${deviceId}/stages/${stageId}/actuators/add`);

  // ⚡ تغيير حالة الـ Actuator (تشغيل / إيقاف)
  const toggleActuator = async (actuator) => {
    const newState = actuator.state === "on" ? "off" : "on";
    try {
      await api.put(`actuators/${actuator._id}`, { state: newState });
      setStage((prev) => ({
        ...prev,
        actuators: prev.actuators.map((a) =>
          a._id === actuator._id ? { ...a, state: newState } : a
        ),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to change actuator state");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-lg text-gray-500">
        Loading stage details...
      </div>
    );

  if (error)
    return <div className="text-center mt-20 text-red-500">{error}</div>;

  if (!stage)
    return <div className="text-center mt-20 text-gray-500">No stage found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md rounded-xl p-8">
      <h1 className="text-3xl font-semibold text-gray-700 mb-6 text-center">
        🌿 Stage Details
      </h1>

      {/* 🧱 تفاصيل الستيدج */}
      <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-6">
        <p><strong>Name:</strong> {stage.name}</p>
        <p><strong>Type:</strong> {stage.type}</p>
        <p><strong>Status:</strong> {stage.status}</p>
        <p><strong>Level:</strong> {stage.level}</p>
        <p><strong>Max Plants:</strong> {stage.maxPlants}</p>
        <p><strong>Garden:</strong> {stage.gardenId?.name}</p>
      </div>

      {/* 🌡️ Sensors Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-700">Sensors</h2>
          <button
            onClick={handleAddSensor}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Add Sensor
          </button>
        </div>

        {stage.sensors?.length > 0 ? (
          <ul className="space-y-2">
            {stage.sensors.map((sensor) => (
              <li
                key={sensor._id}
                className="border rounded-lg p-3 bg-gray-50 flex justify-between items-center"
              >
                <span>
                  <strong>{sensor.type}</strong> ({sensor.unit})
                </span>
                <span className="text-gray-500 text-sm">Value: {sensor.value ?? "—"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No sensors yet.</p>
        )}
      </div>

      {/* ⚙️ Actuators Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-700">Actuators</h2>
          <button
            onClick={handleAddActuator}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            ➕ Add Actuator
          </button>
        </div>

        {stage.actuators?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stage.actuators.map((actuator) => (
              <div
                key={actuator._id}
                className="border rounded-xl p-4 shadow-sm flex flex-col justify-between bg-gray-50"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{actuator.name}</h3>
                  <p className="text-gray-500 text-sm capitalize">
                    Type: {actuator.type}
                  </p>
                  <p className="text-gray-500 text-sm">
                    State:{" "}
                    <span
                      className={`font-semibold ${
                        actuator.state === "on"
                          ? "text-green-600"
                          : actuator.state === "off"
                          ? "text-gray-400"
                          : "text-red-500"
                      }`}
                    >
                      {actuator.state}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => toggleActuator(actuator)}
                  className={`mt-4 py-2 rounded-lg font-medium text-white transition ${
                    actuator.state === "off"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {actuator.state === "off" ? "Turn Off" : "Turn On"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No actuators yet.</p>
        )}
      </div>
    </div>
  );
};

export default StageDetails;
