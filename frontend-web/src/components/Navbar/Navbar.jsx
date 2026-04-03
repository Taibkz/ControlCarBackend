import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { LogOut, LayoutDashboard, CarFront, CalendarPlus, Users, Wrench, CalendarDays, History, CalendarClock, User, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const navLinkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src="/logo.png" alt="ControlCar Logo" className="brand-logo-img" />
          <span className="brand-text">ControlCar</span>
          <span className="brand-role">{user.rol.toLowerCase()}</span>
        </div>

        {/* Hamburger button (mobile only) */}
        <button className="hamburger-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menú">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Nav links */}
        <div className={`navbar-links ${menuOpen ? 'mobile-open' : ''}`}>
          {user.rol === 'CLIENTE' && (
            <>
              <NavLink to="/cliente/panel" className={navLinkClass} onClick={closeMenu}><LayoutDashboard size={17} /> Panel</NavLink>
              <NavLink to="/cliente/mis-vehiculos" className={navLinkClass} onClick={closeMenu}><CarFront size={17} /> Vehículos</NavLink>
              <NavLink to="/cliente/mis-citas" className={navLinkClass} onClick={closeMenu}><CalendarClock size={17} /> Mis Citas</NavLink>
              <NavLink to="/cliente/pedir-cita" className={navLinkClass} onClick={closeMenu}><CalendarPlus size={17} /> Pedir Cita</NavLink>
              <NavLink to="/cliente/perfil" className={navLinkClass} onClick={closeMenu}><User size={17} /> Mi Perfil</NavLink>
            </>
          )}

          {user.rol === 'ADMIN' && (
            <>
              <NavLink to="/admin/panel" className={navLinkClass} onClick={closeMenu}><LayoutDashboard size={17} /> Resumen</NavLink>
              <NavLink to="/admin/citas" className={navLinkClass} onClick={closeMenu}><CalendarPlus size={17} /> Citas</NavLink>
              <NavLink to="/admin/calendario" className={navLinkClass} onClick={closeMenu}><CalendarDays size={17} /> Calendario</NavLink>
              <NavLink to="/admin/historial" className={navLinkClass} onClick={closeMenu}><History size={17} /> Historial</NavLink>
              <NavLink to="/admin/clientes" className={navLinkClass} onClick={closeMenu}><Users size={17} /> Clientes</NavLink>
              <NavLink to="/admin/servicios" className={navLinkClass} onClick={closeMenu}><Wrench size={17} /> Servicios</NavLink>
            </>
          )}

          <div className="navbar-user">
            <span className="user-name">{user.nombreCompleto}</span>
            <button onClick={logout} className="logout-btn" title="Cerrar sesión">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
