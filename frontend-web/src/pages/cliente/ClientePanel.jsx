import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import { CalendarClock, Car, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';

const ClientePanel = () => {
  const { user } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [citasRes, vehiculosRes] = await Promise.all([
          api.get('/cliente/citas'),
          api.get('/cliente/vehiculos')
        ]);
        setCitas(citasRes.data);
        setVehiculos(vehiculosRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Cargando panel...</div>;

  const proximasCitas = citas.filter(c => c.estado === 'PENDIENTE' || c.estado === 'EN_CURSO');

  return (
    <div>
      <PageHeader
        icon={<CalendarClock size={26} color="var(--primary)" />}
        title={`Hola, ${user?.nombreCompleto} 👋`}
        subtitle="Bienvenido a tu panel de control. Gestiona tu garaje y tus próximas visitas."
      />

      <div className="grid-2">
        {/* Tarjeta de Próxima Cita */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <CalendarClock size={20} color="var(--primary)"/> Próximas Citas
            </h2>
            <Link to="/cliente/pedir-cita" className="btn btn-outline" style={{ fontSize: '0.72rem', padding: '0.35rem 0.85rem' }}>
              + Nueva Cita
            </Link>
          </div>

          {proximasCitas.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {proximasCitas.slice(0, 3).map(cita => (
                <div key={cita.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '10px', background: 'var(--bg-main)', transition: 'border-color 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.9rem' }}>{new Date(cita.fechaHora).toLocaleDateString()} a las {new Date(cita.fechaHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong>
                    <span className={`badge ${cita.estado}`}>{cita.estado.replace('_', ' ')}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {cita.servicio?.nombre} — {cita.vehiculo?.marca} {cita.vehiculo?.modelo} ({cita.vehiculo?.matricula})
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', background: 'var(--bg-main)', borderRadius: '10px', border: '1px dashed var(--border-color)' }}>
              <CalendarClock size={32} color="var(--text-muted)" style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
              <p style={{ marginBottom: '1rem' }}>No tienes citas próximas programadas.</p>
              <Link to="/cliente/pedir-cita" className="btn btn-primary">Agendar Ahora</Link>
            </div>
          )}
        </div>

        {/* Tarjeta de Resumen de Vehículos */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Car size={20} color="var(--secondary)"/> Mi Garaje
            </h2>
            <Link to="/cliente/mis-vehiculos" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', padding: '0.35rem 0.85rem' }}>
               Ver todos <ArrowRight size={14}/>
            </Link>
          </div>

          {vehiculos.length > 0 ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               {vehiculos.slice(0, 3).map(veh => (
                 <div key={veh.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '10px', background: 'var(--bg-main)', transition: 'border-color 0.2s' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)' }}>{veh.marca} {veh.modelo}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Año: {veh.anio}</p>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px', letterSpacing: '1px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>
                      {veh.matricula}
                    </span>
                 </div>
               ))}
             </div>
          ) : (
             <div style={{ padding: '2rem 1rem', textAlign: 'center', background: 'var(--bg-main)', borderRadius: '10px', border: '1px dashed var(--border-color)' }}>
              <Car size={32} color="var(--text-muted)" style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
              <p style={{ marginBottom: '1rem' }}>Aún no has registrado ningún vehículo.</p>
              <Link to="/cliente/mis-vehiculos" className="btn btn-primary">Registrar Vehículo</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientePanel;
