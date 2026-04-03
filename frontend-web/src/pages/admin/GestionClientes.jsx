import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Users, Car, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader';

const GestionClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [clientesRes, vehiculosRes] = await Promise.all([
        api.get('/admin/clientes'),
        api.get('/admin/vehiculos')
      ]);
      setClientes(clientesRes.data);
      setVehiculos(vehiculosRes.data);
    } catch (error) {
      console.error(error);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEliminarCliente = async (id) => {
    if(window.confirm('¿Seguro? Se eliminarán también sus vehículos y citas asociadas.')) {
      try {
         await api.delete(`/admin/clientes/${id}`);
         fetchData();
      } catch (error) {
         alert("Error suprimiendo cliente");
      }
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Cargando datos del sistema...</div>;

  return (
    <div>
      <PageHeader
        icon={<Users size={26} color="var(--primary)" />}
        title="Directorio de Clientes"
        subtitle="Usuarios registrados y sus flotas de vehículos asociadas."
      />

      <div className="card">
        {clientes.length > 0 ? (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {clientes.map(cliente => {
               const cochesCliente = vehiculos.filter(v => v.propietario?.id === cliente.id);
               
               return (
                 <div key={cliente.id} style={{ border: '1px solid var(--border-color)', borderRadius: '14px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                    {/* Cabecera del Cliente */}
                    <div style={{ padding: '1.25rem', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <div style={{
                           width: '44px', height: '44px', borderRadius: '50%',
                           background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                           color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
                           fontSize: '1.25rem', fontWeight: 800,
                           boxShadow: 'var(--shadow-glow-red)', flexShrink: 0
                         }}>
                           {cliente.nombreCompleto.charAt(0).toUpperCase()}
                         </div>
                         <div>
                           <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)' }}>{cliente.nombreCompleto}</h3>
                           <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{cliente.email} · @{cliente.username}</p>
                         </div>
                      </div>
                      <button onClick={() => handleEliminarCliente(cliente.id)} className="btn btn-danger" style={{ padding: '0.45rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                        <Trash2 size={15}/> Eliminar
                      </button>
                    </div>

                    {/* Lista de Vehículos del Cliente */}
                    <div style={{ padding: '1.25rem', background: 'var(--bg-main)' }}>
                       <h4 style={{ margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          <Car size={14} /> Vehículos Registrados ({cochesCliente.length})
                       </h4>
                       
                       {cochesCliente.length > 0 ? (
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                           {cochesCliente.map(coche => (
                             <div key={coche.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: '10px', boxShadow: 'var(--shadow-card)' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                 <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{coche.marca} {coche.modelo}</span>
                                 <span className="badge" style={{ background: 'rgba(250, 204, 21, 0.1)', color: 'var(--accent)', border: '1px solid rgba(250, 204, 21, 0.3)', fontSize: '0.7rem' }}>{coche.anio || 'N/A'}</span>
                               </div>
                               <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '4px', display: 'inline-block', border: '1px solid var(--border-color)', letterSpacing: '1px' }}>
                                 {coche.matricula}
                               </div>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0, fontStyle: 'italic' }}>Este cliente aún no tiene vehículos registrados.</p>
                       )}
                    </div>
                 </div>
               );
             })}
           </div>
        ) : (
           <div style={{ textAlign: 'center', padding: '3rem' }}>
             <Users size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
             <p style={{ color: 'var(--text-muted)' }}>No hay clientes registrados en el sistema.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default GestionClientes;
