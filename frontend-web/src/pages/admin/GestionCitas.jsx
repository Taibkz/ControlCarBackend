import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { CalendarClock, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader';

const GestionCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCitas = async () => {
    try {
      const res = await api.get('/admin/citas');
      setCitas(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await api.put(`/admin/citas/${id}/estado?estado=${nuevoEstado}`);
      fetchCitas();
    } catch (error) {
      alert("Error al actualizar la cita");
      console.error(error);
    }
  };

  const handleEliminar = async (id) => {
    if(window.confirm('¿Seguro que deseas eliminar esta cita permanentemente?')) {
      try {
        await api.delete(`/admin/citas/${id}`);
        fetchCitas();
      } catch (error) {
         alert("Error al eliminar");
      }
    }
  }

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Cargando citas...</div>;

  const agrupadas = {
    PENDIENTE: citas.filter(c => c.estado === 'PENDIENTE'),
    CONFIRMADA: citas.filter(c => c.estado === 'CONFIRMADA'),
    EN_CURSO: citas.filter(c => c.estado === 'EN_CURSO'),
    FINALIZADA: citas.filter(c => c.estado === 'FINALIZADA'),
    CANCELADA: citas.filter(c => c.estado === 'CANCELADA')
  };

  const columnas = [
    { key: 'PENDIENTE', title: 'Pendientes', color: '#fcd34d', bg: 'rgba(245, 158, 11, 0.1)' },
    { key: 'CONFIRMADA', title: 'Confirmadas', color: '#93c5fd', bg: 'rgba(59, 130, 246, 0.1)' },
    { key: 'EN_CURSO', title: 'En Curso', color: '#d8b4fe', bg: 'rgba(168, 85, 247, 0.1)' },
    { key: 'FINALIZADA', title: 'Finalizadas', color: '#6ee7b7', bg: 'rgba(16, 185, 129, 0.1)' },
    { key: 'CANCELADA', title: 'Canceladas', color: '#fca5a5', bg: 'rgba(239, 68, 68, 0.1)' }
  ];

  return (
    <div>
      <PageHeader
        icon={<CalendarClock size={26} color="var(--primary)" />}
        title="Tablero de Citas"
        subtitle="Gestiona el flujo de trabajo del taller. Cambia el estado para organizar los vehículos."
      />

      {citas.length === 0 ? (
         <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <CalendarClock size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <p style={{ color: 'var(--text-muted)' }}>No hay citas registradas en el sistema todavía.</p>
         </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', paddingBottom: '1rem', minHeight: '600px' }}>
          {columnas.map(col => (
            <div key={col.key} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '14px', padding: '1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${col.color}`, paddingBottom: '0.5rem' }}>
                 <h3 style={{ margin: 0, fontSize: '0.9rem', color: col.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {col.title}
                 </h3>
                 <span style={{ background: col.bg, color: col.color, padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {agrupadas[col.key].length}
                 </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
                 {agrupadas[col.key].map(cita => (
                    <div key={cita.id} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.85rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'border-color 0.2s, transform 0.15s' }}>
                       
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>#{cita.id}</span>
                          <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                            {new Date(cita.fechaHora).toLocaleDateString()} {new Date(cita.fechaHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                       </div>

                       <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', color: 'var(--text-main)' }}>{cita.cliente?.nombreCompleto || 'Desconocido'}</h4>
                       
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                          🚗 {cita.vehiculo?.marca} {cita.vehiculo?.modelo}
                          <span style={{ fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', padding: '1px 4px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.75rem' }}>{cita.vehiculo?.matricula}</span>
                       </div>
                       
                       <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginBottom: '0.85rem', fontWeight: 600 }}>
                          🔧 {cita.servicio?.nombre}
                       </div>

                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem', gap: '0.5rem' }}>
                          <select 
                            className="form-select" 
                            value={cita.estado} 
                            onChange={(e) => handleEstadoChange(cita.id, e.target.value)}
                            style={{ padding: '0.25rem 0.4rem', fontSize: '0.72rem', width: 'auto', background: col.bg, color: col.color, border: `1px solid ${col.color}40`, fontWeight: 700, borderRadius: '6px', flex: 1 }}
                          >
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="CONFIRMADA">CONFIRMADA</option>
                            <option value="EN_CURSO">EN CURSO</option>
                            <option value="FINALIZADA">FINALIZADA</option>
                            <option value="CANCELADA">CANCELADA</option>
                          </select>

                          <button onClick={() => handleEliminar(cita.id)} className="btn btn-outline" style={{ padding: '0.25rem 0.4rem', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)', minWidth: 'unset' }} title="Eliminar Cita">
                            <Trash2 size={14}/>
                          </button>
                       </div>

                    </div>
                 ))}
                 
                 {agrupadas[col.key].length === 0 && (
                    <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: 'var(--border-color)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                      Sin citas
                    </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GestionCitas;
