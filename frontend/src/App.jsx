import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Register from './Pages/Register';
import DashboardSwitcher from './Components/DashboardSwitcher';
import ScheduleService from './Pages/ServiceBooking';
import History from './Pages/History';
import ServiceTracking from './Pages/ServiceTracking';
import VehicleManagement from './Pages/VehicleManagement';

function MainApp(){
    document.title = "AutoCare Hub";
    return (
        <div>
            <Routes>
                <Route path="/" element= {<Landing />}/>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<DashboardSwitcher />} />
                <Route path="/servicebooking" element={<ScheduleService />} />
                <Route path="/servicehistory" element={<History />} />
                <Route path="/servicetracking" element={<ServiceTracking />} />
                <Route path="/vehiclemanagement" element={<VehicleManagement />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <MainApp />
        </BrowserRouter>
  );
}

export default App;
