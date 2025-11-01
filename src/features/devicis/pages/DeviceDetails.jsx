import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../../lib/api";

const socket = io("http://localhost:3001"); // ✨ نفس بورت السيرفر

const DeviceDetails = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState(null);
  const [readings, setReadings] = useState({}); // { stageId: [ {sensorId, value, unit}, ...] }

  // ✅ تحميل بيانات الجهاز
  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const res = await api.get(`devices/${deviceId}`);
        setDevice(res.data);
      } catch (err) {
        console.error("Error fetching device:", err);
      }
    };
    fetchDevice();
  }, [deviceId]);

  // ✅ استقبال البيانات الحية من السوكت
  useEffect(() => {
    if (!deviceId) return;

    const room = `device_${deviceId}`;
    socket.emit("join_device_room", room);

    // جلب البيانات من الـ API لو ما فيش بيانات في السوكت
    const fetchInitialData = async () => {
      try {
        const res = await api.get(`telemetries/devices/${deviceId}`);

        if (res.data.success && res.data.data.length > 0) {
          const initialReadings = {};
          res.data.data.forEach(stage => {
            initialReadings[stage.stageId] = stage.readings;
          });

          setReadings(prev => ({ ...prev, ...initialReadings }));
        }
      } catch (err) {
        console.error("❌ Error fetching initial telemetry:", err);
      }
    };

    // أول mount: نجيب البيانات من API
    fetchInitialData();

    const handler = (data) => {
      console.log("📡 telemetry_update received:", data);

      setReadings(prev => {
        const updated = { ...prev };

        data.readings.forEach((reading) => {
          const stageId = reading.stageId;
          const stageReadings = updated[stageId] || [];
          const sensorIndex = stageReadings.findIndex(r => r.sensorId === reading.sensorId);

          if (sensorIndex > -1) {
            stageReadings[sensorIndex] = reading;
          } else {
            stageReadings.push(reading);
          }

          updated[stageId] = stageReadings;
        });

        return updated;
      });
    };

    socket.on("telemetry_update", handler);

    return () => {
      socket.off("telemetry_update", handler);
      socket.emit("leave_device_room", room);
    };
  }, [deviceId]);





  if (!device)
    return (
      <div className="text-center mt-20 text-lg text-gray-500">
        Loading device details...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-xl p-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-700 text-center">
        Device Details (Live)
      </h1>

      {/* بيانات الجهاز */}
      <div className="space-y-2 border-b pb-4 mb-4">
        <p><span className="font-semibold">Model:</span> {device.model}</p>
        <p><span className="font-semibold">Serial:</span> {device.serial}</p>
        <p><span className="font-semibold">Status:</span>{" "}
          <span className={`font-medium ${device.status === "active" ? "text-green-600" : "text-red-500"}`}>
            {device.status}
          </span>
        </p>
      </div>

      {/* الـ Stages */}
      <div className="space-y-4">
        {device.stages?.map((stage) => (
          <div
            key={stage._id}
            className="border rounded-lg p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => navigate(`/gardens/${device.gardenId}/devices/${device._id}/stages/${stage._id}`)}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-700">{stage.name}</h2>
            </div>

            {/* قراءات السوكت */}
            <div className="mt-2 pl-3 border-l-2 border-green-500">
              <h3 className="text-gray-600 font-medium mb-1">Live Readings:</h3>

              {readings[stage._id]?.length ? (
                <ul className="text-sm text-gray-700 space-y-1">
                  {readings[stage._id].map((r, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{r.sensorId}</span>
                      <span>{r.value} {r.unit} ({r.type})</span> {/* أضفنا الـ type */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm italic">No live data yet...</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceDetails;
