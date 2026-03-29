import Login from '../Pages/Login';
import CustomerDashboard from '../Pages/CustomerDashboard';
import ManagerDashboard from '../Pages/ManagerDashboard';
import MechanicDashboard from '../Pages/MechanicDashboard';

function DashboardSwitcher() {
    const user = { role: 'customer' };
    if (user.role === 'customer') return <CustomerDashboard />;
    if (user.role === 'manager') return <ManagerDashboard />;
    if (user.role === 'mechanic') return <MechanicDashboard />;
    return <Login />;
}

export default DashboardSwitcher;