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

  const iconoPorCategoria = (categoria) => {
    switch (categoria) {
      case 'Hardware': return '🖨️';
      case 'Software': return '💾';
      case 'Red': return '🌐';
      case 'Correo Electrónico': return '✉️';
      default: return '❓';
    }
  };

  const preguntasFrecuentes = [
    {
      pregunta: "¿La impresora no imprime?",
      respuesta: "Verifica que esté encendida, conectada al computador y con papel. Reinicia si es necesario.",
    },
    {
      pregunta: "¿No tengo internet?",
      respuesta: "Revisa si otros dispositivos tienen conexión. Intenta reiniciar el router o comunicar al área de redes.",
    },
    {
      pregunta: "¿No puedo enviar correos?",
      respuesta: "Asegúrate de tener conexión y revisar si el correo no está bloqueado por peso de archivo. Consulta soporte si persiste.",
    },
    {
      pregunta: "¿El sistema está lento o se congela?",
      respuesta: "Cierra programas innecesarios, reinicia el equipo y verifica si hay espacio en disco.",
    },
  ];

  return (
    <div className="usuario-home">
      <button className="logout-button" onClick={cerrarSesion}>Cerrar sesión</button>
      <h2>Gestión de Soporte Informático</h2>

      <h3>¿Tienes un problema? Revisa esto primero:</h3>
      <div className="faq-section">
        {preguntasFrecuentes.map((faq, index) => (
          <details key={index} className="faq-item">
            <summary>{faq.pregunta}</summary>
            <p>{faq.respuesta}</p>
          </details>
        ))}
      </div>

      <h3>Crear nuevo ticket</h3>
      <form onSubmit={manejarEnvio}>
        <label>Título del problema:</label>
        <input
          type="text"
          placeholder="Ej: No puedo imprimir"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <label>Describe tu problema:</label>
        <textarea
          placeholder="Cuéntanos qué está ocurriendo..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows="4"
          required
        />

        <label>Prioridad:</label>
        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
          <option value="Alta">Alta (problema urgente)</option>
          <option value="Media">Media (interfiere pero puedo trabajar)</option>
          <option value="Baja">Baja (no urgente)</option>
        </select>

        <label>Categoría del problema:</label>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="Hardware">Hardware – Ej: impresoras, pantallas, cables</option>
          <option value="Software">Software – Ej: Word, Excel, programas</option>
          <option value="Red">Red – Ej: sin internet, conexión lenta</option>
          <option value="Correo Electrónico">Correo – Ej: no llega o no puedo enviar</option>
          <option value="Otro">Otro – No estoy seguro</option>
        </select>

        <button type="submit" className="btn-enviar">Enviar Ticket</button>
      </form>

      <h3>Mis Tickets</h3>
      {tickets.length === 0 ? (
        <p>No has creado tickets aún.</p>
      ) : (
        <ul className="ticket-list">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <div className="ticket-encabezado">
                <span className="ticket-icono">{iconoPorCategoria(ticket.categoria)}</span>
                <strong>{ticket.titulo}</strong>
              </div>
              <p>{ticket.descripcion}</p>
              <small>
                Categoría: {ticket.categoria} | Prioridad: {ticket.prioridad} | Estado: {ticket.estado}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UsuarioHome;



