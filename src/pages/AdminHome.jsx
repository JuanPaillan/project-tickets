import './AdminHome.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminHome() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  useEffect(() => {
    const datos = localStorage.getItem('ticketsUsuario');
    if (datos) {
      setTickets(JSON.parse(datos));
    }
  }, []);

  const cambiarEstado = (id, nuevoEstado) => {
    const ticketsActualizados = tickets.map(ticket =>
      ticket.id === id ? { ...ticket, estado: nuevoEstado } : ticket
    );
    setTickets(ticketsActualizados);
    localStorage.setItem('ticketsUsuario', JSON.stringify(ticketsActualizados));
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
  };

  const ticketsFiltrados = filtroEstado === 'Todos'
    ? tickets
    : tickets.filter(ticket => ticket.estado === filtroEstado);

  return (
    <div className="admin-home">
      <button className="logout-button" onClick={cerrarSesion}>Cerrar sesión</button>
      <h2>Panel de Administración – Soporte Técnico</h2>

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
            <li key={ticket.id}>
              <strong>{ticket.titulo}</strong>
              <p>{ticket.descripcion}</p>
              <small>
                Categoría: {ticket.categoria} | Prioridad: {ticket.prioridad} | Estado actual: <strong>{ticket.estado}</strong>
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
