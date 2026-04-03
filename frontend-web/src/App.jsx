import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Layout from './layout/Layout';
import AdminPanel from './pages/admin/AdminPanel';
import GestionCitas from './pages/admin/GestionCitas';
import GestionClientes from './pages/admin/GestionClientes';
import GestionServicios from './pages/admin/GestionServicios';
import CalendarioCitas from './pages/admin/CalendarioCitas';
import HistorialCitas from './pages/admin/HistorialCitas';
import ClientePanel from './pages/cliente/ClientePanel';
import MisVehiculos from './pages/cliente/MisVehiculos';
import PedirCita from './pages/cliente/PedirCita';
import MisCitas from './pages/cliente/MisCitas';
import MiPerfil from './pages/cliente/MiPerfil';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      
      {/* Rutas de Administrador */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roleRequired="ADMIN">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="panel" element={<AdminPanel />} />
        <Route path="citas" element={<GestionCitas />} />
        <Route path="clientes" element={<GestionClientes />} />
        <Route path="servicios" element={<GestionServicios />} />
        <Route path="calendario" element={<CalendarioCitas />} />
        <Route path="historial" element={<HistorialCitas />} />
      </Route>

      {/* Rutas de Cliente */}
      <Route
        path="/cliente"
        element={
          <ProtectedRoute roleRequired="CLIENTE">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="panel" element={<ClientePanel />} />
        <Route path="mis-vehiculos" element={<MisVehiculos />} />
        <Route path="pedir-cita" element={<PedirCita />} />
        <Route path="mis-citas" element={<MisCitas />} />
        <Route path="perfil" element={<MiPerfil />} />
      </Route>
    </Routes>
  );
}

export default App;
