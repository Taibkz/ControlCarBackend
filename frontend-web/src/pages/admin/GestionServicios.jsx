import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Wrench, Plus, Pencil, Trash2, Clock, Euro } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useToast } from '../../components/Toast/Toast';
import { SkeletonList } from '../../components/Skeleton/Skeleton';

const EMPTY = { nombre: '', descripcion: '', precio: '', duracionMinutos: 60 };

const GestionServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null); // null = crear, obj = editar
  const [form, setForm] = useState(EMPTY);
  const toast = useToast();

  const fetchServicios = async () => {
    try {
      const res = await api.get('/admin/servicios');
      setServicios(res.data);
    } catch {
      toast('Error cargando servicios', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServicios(); }, []);

  const openCreate = () => { setEditando(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (s) => { setEditando(s); setForm({ nombre: s.nombre, descripcion: s.descripcion || '', precio: s.precio || '', duracionMinutos: s.duracionMinutos || 60 }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditando(null); setForm(EMPTY); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, precio: parseFloat(form.precio), duracionMinutos: parseInt(form.duracionMinutos) };
    try {
      if (editando) {
        await api.put(`/admin/servicios/${editando.id}`, payload);
        toast('Servicio actualizado correctamente', 'success');
      } else {
        await api.post('/admin/servicios', payload);
        toast('Servicio creado correctamente', 'success');
      }
      closeForm();
      fetchServicios();
    } catch {
      toast('Error al guardar el servicio', 'error');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este servicio?')) return;
    try {
      await api.delete(`/admin/servicios/${id}`);
      toast('Servicio eliminado', 'info');
      fetchServicios();
    } catch {
      toast('Error al eliminar el servicio', 'error');
    }
  };

  return (
    <div>
      <PageHeader
        icon={<Wrench size={26} color="var(--primary)" />}
        title="Gestión de Servicios"
        subtitle="Crea, edita y administra los servicios ofrecidos en el taller."
        action={!showForm && (
          <button className="btn btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={17} /> Nuevo Servicio
          </button>
        )}
      />

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '3px solid var(--primary)', boxShadow: 'var(--shadow-glow-red)' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1.05rem' }}>{editando ? '✏️ Editar Servicio' : '➕ Nuevo Servicio'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Nombre del Servicio *</label>
              <input required className="form-input" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej: Cambio de aceite" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Descripción</label>
              <textarea className="form-input" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Descripción del servicio..." style={{ resize: 'vertical', minHeight: '70px' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Precio (€) *</label>
              <input required type="number" step="0.01" min="0" className="form-input" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} placeholder="Ej: 45.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Duración (minutos) *</label>
              <input required type="number" min="15" step="15" className="form-input" value={form.duracionMinutos} onChange={e => setForm({...form, duracionMinutos: e.target.value})} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={closeForm}>Cancelar</button>
              <button type="submit" className="btn btn-primary">{editando ? 'Guardar Cambios' : 'Crear Servicio'}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <SkeletonList rows={4} />
      ) : servicios.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Wrench size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <p>No hay servicios configurados. Crea el primero.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {servicios.map(s => (
            <div key={s.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem' }}>{s.nombre}</h3>
                {s.descripcion && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.descripcion}</p>}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 700 }}>
                    <Euro size={14} /> {s.precio ?? '—'}€
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Clock size={14} /> {s.duracionMinutos} min
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button className="btn btn-outline" onClick={() => openEdit(s)} style={{ padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.83rem' }}>
                  <Pencil size={14} /> Editar
                </button>
                <button className="btn btn-danger" onClick={() => handleEliminar(s.id)} style={{ padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.83rem' }}>
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GestionServicios;
