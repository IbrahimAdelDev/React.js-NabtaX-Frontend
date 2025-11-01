import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from '../features/auth/pages/loginPage';
import SigninPage from '../features/auth/pages/signinPage';
import MyGardens from "../features/gardens/pages/MyGardens";
import AddGardenPage from "../features/gardens/pages/AddGarden";
import GardenDetails from "../features/gardens/pages/GardenDetails";
import AddDevice from "../features/devicis/pages/AddDevice";
import DeviceDetails from "../features/devicis/pages/DeviceDetails";
import AddStage from "../features/stages/pages/AddStage";
import StageDetails from "../features/stages/pages/StageDetails";
import AddActuator from "../features/actuators/pages/AddActuator";
import AddSensor from "../features/sensors/pages/AddSensor";
import ProtectedRoute from './protectedRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route
          path="/gardens"
          element={
            <ProtectedRoute>
              <MyGardens />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gardens/add"
          element={
            <ProtectedRoute>
              <AddGardenPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gardens/:gardenId"
          element={
            <ProtectedRoute>
              <GardenDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gardens/:gardenId/devices/add"
          element={
            <ProtectedRoute>
              <AddDevice />
              {/* <AddStage /> */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/gardens/:gardenId/devices/:deviceId"
          element={
            <ProtectedRoute>
              <DeviceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gardens/:gardenId/devices/:deviceId/stages/add"
          element={
            <ProtectedRoute>
              <AddStage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gardens/:gardenId/devices/:deviceId/stages/:stageId"
          element={
            <ProtectedRoute>
              <StageDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gardens/:gardenId/devices/:deviceId/stages/:stageId/actuators/add"
          element={
            <ProtectedRoute>
              <AddActuator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gardens/:gardenId/devices/:deviceId/stages/:stageId/sensors/add"
          element={
            <ProtectedRoute>
              <AddSensor />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/" element={<h1>Welcome to the home page!</h1>} /> */}
      </Routes>
    </BrowserRouter>
  );
}