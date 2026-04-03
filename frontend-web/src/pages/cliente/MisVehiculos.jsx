import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Car, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader';

const MisVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    matricula: '', marca: '', modelo: '', anio: ''
  });

  const fetchVehiculos = async () => {
    try {
      const res = await api.get('/cliente/vehiculos');
      setVehiculos(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cliente/vehiculos', nuevoVehiculo);
      setNuevoVehiculo({ matricula: '', marca: '', modelo: '', anio: '' });
      setShowForm(false);
      fetchVehiculos();
    } catch (error) {
      const msj = error.response?.data || "Error al guardar el vehículo";
      alert(msj);
      console.error(error);
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Cargando vehículos...</div>;

  return (
    <div>
      <PageHeader
        icon={<Car size={26} color="var(--primary)" />}
        title="Mis Vehículos"
        subtitle="Gestiona los vehículos asociados a tu cuenta."
        action={!showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={17} /> Añadir Vehículo
          </button>
        )}
      />

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '3px solid var(--primary)', boxShadow: 'var(--shadow-glow-red)' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1.05rem', color: 'var(--text-main)' }}>Registrar Nuevo Vehículo</h3>
          <form onSubmit={handleCreate} className="grid-2">
            <div className="form-group">
              <label className="form-label">Matrícula</label>
              <input required type="text" className="form-input" value={nuevoVehiculo.matricula} onChange={e => setNuevoVehiculo({...nuevoVehiculo, matricula: e.target.value})} placeholder="Ej: 1234ABC"/>
            </div>
            <div className="form-group">
              <label className="form-label">Marca</label>
              <input required type="text" className="form-input" value={nuevoVehiculo.marca} onChange={e => setNuevoVehiculo({...nuevoVehiculo, marca: e.target.value})} placeholder="Ej: Toyota"/>
            </div>
            <div className="form-group">
              <label className="form-label">Modelo</label>
              <input required type="text" className="form-input" value={nuevoVehiculo.modelo} onChange={e => setNuevoVehiculo({...nuevoVehiculo, modelo: e.target.value})} placeholder="Ej: Corolla"/>
            </div>
            <div className="form-group">
              <label className="form-label">Año</label>
              <input required type="number" className="form-input" value={nuevoVehiculo.anio} onChange={e => setNuevoVehiculo({...nuevoVehiculo, anio: e.target.value})} placeholder="Ej: 2020"/>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Registrar</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-2">
        {vehiculos.map(veh => (
          <div key={veh.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Top: brand accent line (inherited from card::before hover) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem', color: 'var(--text-main)' }}>{veh.marca} {veh.modelo}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Año: {veh.anio}</p>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontWeight: 700,
                letterSpacing: '2px',
                color: 'var(--text-main)',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                {veh.matricula}
              </div>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
               <button className="btn" style={{ color: 'var(--danger)', background: 'transparent', padding: '0.25rem' }} onClick={() => alert('Para eliminar, contacte con administración (por las citas asociadas)')}>
                 <Trash2 size={17}/>
               </button>
            </div>
          </div>
        ))}
        {vehiculos.length === 0 && !showForm && (
          <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '14px', border: '1px dashed var(--border-color)' }}>
             <Car size={52} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.35 }}/>
             <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Sin vehículos registrados</h3>
             <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Añade tu primer vehículo para comenzar a pedir citas en el taller.</p>
             <button className="btn btn-primary" onClick={() => setShowForm(true)}>
               <Plus size={17} /> Añadir mi primer vehículo
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisVehiculos;
