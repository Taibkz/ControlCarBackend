import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import { Users, CalendarClock, Activity } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ totalCitas: 0, totalClientes: 0, citas: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanelData = async () => {
      try {
        const res = await api.get('/admin/panel');
        setData(res.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPanelData();
  }, []);

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Cargando métricas...</div>;

  const citasRecientes = data.citas.slice(0, 5);

  return (
    <div>
      <PageHeader
        icon={<Activity size={26} color="var(--primary)" />}
        title="Panel de Administración"
        subtitle="Visión general del taller y las métricas principales."
      />

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(135deg, rgba(225,29,72,0.15) 0%, rgba(159,18,57,0.1) 100%)', borderColor: 'rgba(225,29,72,0.25)' }}>
          <div style={{ padding: '1rem', background: 'rgba(225,29,72,0.15)', borderRadius: '14px', border: '1px solid rgba(225,29,72,0.3)', boxShadow: '0 0 20px rgba(225,29,72,0.2)' }}>
             <CalendarClock size={32} color="#e11d48" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Citas</p>
            <h2 style={{ margin: 0, fontSize: '2.75rem', color: 'var(--text-main)', fontWeight: 900, lineHeight: 1 }}>{data.totalCitas}</h2>
          </div>
        </div>

        <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(135deg, rgba(234,179,8,0.12) 0%, rgba(202,138,4,0.08) 100%)', borderColor: 'rgba(234,179,8,0.2)' }}>
           <div style={{ padding: '1rem', background: 'rgba(234,179,8,0.12)', borderRadius: '14px', border: '1px solid rgba(234,179,8,0.25)', boxShadow: '0 0 20px rgba(234,179,8,0.15)' }}>
             <Users size={32} color="#eab308" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Clientes Totales</p>
            <h2 style={{ margin: 0, fontSize: '2.75rem', color: 'var(--text-main)', fontWeight: 900, lineHeight: 1 }}>{data.totalClientes}</h2>
          </div>
        </div>
      </div>

      <div className="card">
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0, fontSize: '1.1rem' }}>
               <Activity size={18} color="var(--primary)" /> Últimas Citas Registradas
            </h3>
         </div>
         
         {citasRecientes.length > 0 ? (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {citasRecientes.map(cita => (
                 <div key={cita.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-main)', transition: 'border-color 0.2s' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                       {/* Bloque de Fecha Visual */}
                       <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center', minWidth: '72px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                          <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                             {new Date(cita.fechaHora).getDate()}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>
                             {new Date(cita.fechaHora).toLocaleString('es-ES', { month: 'short' })}
                          </span>
                          <div style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                             {new Date(cita.fechaHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                       </div>
                       
                       {/* Detalles de Cita */}
                       <div>
                          <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                             {cita.cliente?.nombreCompleto || 'Desconocido'} 
                             <span className={`badge ${cita.estado}`}>
                                {cita.estado.replace('_', ' ')}
                             </span>
                          </h4>
                          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                             🚗 {cita.vehiculo?.marca} {cita.vehiculo?.modelo} <span style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '4px', marginLeft: '4px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>{cita.vehiculo?.matricula}</span>
                          </p>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: 600 }}>
                             🔧 {cita.servicio?.nombre}
                          </p>
                       </div>
                    </div>

                 </div>
              ))}
           </div>
         ) : (
           <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No hay citas registradas recientemente.</p>
         )}
      </div>

    </div>
  );
};

export default AdminPanel;
