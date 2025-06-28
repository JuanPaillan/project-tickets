import './UsuarioHome.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UsuarioHome() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('Media');
  const [categoria, setCategoria] = useState('Hardware');
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const datos = localStorage.getItem('ticketsUsuario');
    if (datos) {
      setTickets(JSON.parse(datos));
    }
  }, []);

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevoTicket = {
      id: Date.now(),
      titulo,
      descripcion,
      prioridad,
      categoria,
      estado: 'Pendiente',
    };

    const nuevosTickets = [...tickets, nuevoTicket];
    setTickets(nuevosTickets);
    localStorage.setItem('ticketsUsuario', JSON.stringify(nuevosTickets));

    setTitulo('');
    setDescripcion('');
    setPrioridad('Media');
    setCategoria('Hardware');
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="usuario-home">
      <button className="logout-button" onClick={cerrarSesion}>Cerrar sesión</button>
      <h2>Gestión de Soporte Informático</h2>

      <h3>Crear nuevo ticket</h3>
      <form onSubmit={manejarEnvio}>
        <input
          type="text"
          placeholder="Título del problema"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <textarea
          placeholder="Descripción detallada"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows="4"
          required
        />

        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
          <option value="Red">Red</option>
          <option value="Correo Electrónico">Correo Electrónico</option>
          <option value="Otro">Otro</option>
        </select>

        <button type="submit">Enviar Ticket</button>
      </form>

      <h3>Mis Tickets</h3>
      {tickets.length === 0 ? (
        <p>No has creado tickets aún.</p>
      ) : (
        <ul className="ticket-list">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <strong>{ticket.titulo}</strong>
              <p>{ticket.descripcion}</p>
              <small>Categoría: {ticket.categoria} | Prioridad: {ticket.prioridad} | Estado: {ticket.estado}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UsuarioHome;

