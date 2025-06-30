import './AdminHome.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import {
  collection,
  onSnapshot,
  updateDoc,
  doc
} from 'firebase/firestore';

function AdminHome() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tickets'), (snapshot) => {
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTickets(datos);
    });

    return () => unsubscribe();
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const ref = doc(db, 'tickets', id);
      await updateDoc(ref, { estado: nuevoEstado });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
  };

  const ticketsFiltrados = filtroEstado === 'Todos'
    ? tickets
    : tickets.filter(ticket => ticket.estado === filtroEstado);

  const total = tickets.length;
  const pendientes = tickets.filter(t => t.estado === 'Pendiente').length;
  const enProceso = tickets.filter(t => t.estado === 'En proceso').length;
  const resueltos = tickets.filter(t => t.estado === 'Resuelto').length;

  const iconoPorCategoria = (categoria) => {
    switch (categoria) {
      case 'Hardware': return '🖨️';
      case 'Software': return '💾';
      case 'Red': return '🌐';
      case 'Correo Electrónico': return '✉️';
      default: return '❓';
    }
  };

  const claseEstado = (estado) => {
    if (estado === 'Pendiente') return 'pendiente';
    if (estado === 'En proceso') return 'en-proceso';
    if (estado === 'Resuelto') return 'resuelto';
    return '';
  };

  return (
    <div className="admin-home">
      <button className="logout-button" onClick={cerrarSesion}>Cerrar sesión</button>
      <h2>Panel de Administración – Soporte Técnico</h2>

      {/* DASHBOARD DE ESTADÍSTICAS */}
      <div className="dashboard">
        <div className="card total">📋 Total: {total}</div>
        <div className="card pendiente">🕒 Pendientes: {pendientes}</div>
        <div className="card en-proceso">🔧 En proceso: {enProceso}</div>
        <div className="card resuelto">✅ Resueltos: {resueltos}</div>
      </div>

      <div className="filtro-container">
        <label>Filtrar por estado: </label>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En proceso">En proceso</option>
          <option value="Resuelto">Resuelto</option>
        </select>
      </div>

      {ticketsFiltrados.length === 0 ? (
        <p>No hay tickets en este estado.</p>
      ) : (
        <ul className="ticket-list">
          {ticketsFiltrados.map((ticket) => (
            <li key={ticket.id} className={claseEstado(ticket.estado)}>
              <div className="ticket-encabezado">
                <span className="ticket-icono">{iconoPorCategoria(ticket.categoria)}</span>
                <strong>{ticket.titulo}</strong>
              </div>
              <p>{ticket.descripcion}</p>
              <small>
                Usuario: {ticket.correoUsuario}<br />
                Categoría: {ticket.categoria} | Prioridad: {ticket.prioridad} | Estado actual: {ticket.estado}
              </small>
              <div className="estado-selector">
                <label>Cambiar estado: </label>
                <select
                  value={ticket.estado}
                  onChange={(e) => cambiarEstado(ticket.id, e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Resuelto">Resuelto</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminHome;



