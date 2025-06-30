import './UsuarioHome.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

function UsuarioHome() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('Media');
  const [categoria, setCategoria] = useState('Hardware');
  const [tickets, setTickets] = useState([]);
  const [correoUsuario, setCorreoUsuario] = useState('');

  const preguntasFrecuentes = [
    {
      pregunta: "¿La impresora no imprime?",
      respuesta: "Asegúrate de que esté conectada, encendida, con papel y tinta. Reinicia si es necesario.",
    },
    {
      pregunta: "¿No tengo internet?",
      respuesta: "Verifica si otros dispositivos tienen conexión. Intenta reiniciar el router o avisar a soporte.",
    },
    {
      pregunta: "¿No puedo enviar correos?",
      respuesta: "Comprueba que tienes conexión y que el archivo adjunto no sea demasiado grande.",
    },
    {
      pregunta: "¿El sistema está lento?",
      respuesta: "Cierra programas innecesarios, reinicia el equipo y verifica el espacio disponible.",
    },
  ];

  useEffect(() => {
    const usuario = auth.currentUser;
    if (usuario) {
      setCorreoUsuario(usuario.email);

      const q = query(
        collection(db, 'tickets'),
        where('correoUsuario', '==', usuario.email)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        setTickets(docs);
      });

      return () => unsubscribe();
    }
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'tickets'), {
        titulo,
        descripcion,
        prioridad,
        categoria,
        estado: 'Pendiente',
        correoUsuario,
        fecha: serverTimestamp()
      });

      setTitulo('');
      setDescripcion('');
      setPrioridad('Media');
      setCategoria('Hardware');
    } catch (error) {
      console.error('Error al guardar ticket:', error);
    }
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

  return (
    <div className="usuario-home">
      <div className="usuario-header">
        <h2>Bienvenido</h2>
        <button className="logout-button" onClick={cerrarSesion}>Cerrar sesión</button>
      </div>

      <section className="faq-section">
        <h3>Antes de reportar, revisa:</h3>
        {preguntasFrecuentes.map((faq, index) => (
          <details key={index} className="faq-item">
            <summary>{faq.pregunta}</summary>
            <p>{faq.respuesta}</p>
          </details>
        ))}
      </section>

      <section className="formulario-section">
        <h3>Crear nuevo ticket</h3>
        <form onSubmit={manejarEnvio} className="ticket-form">
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
            placeholder="Explica brevemente lo que ocurre"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={4}
          />

          <label>Prioridad:</label>
          <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
            <option value="Alta">Alta (urgente)</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          <label>Categoría del problema:</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="Hardware">Hardware (impresoras, monitores...)</option>
            <option value="Software">Software (programas, sistema)</option>
            <option value="Red">Red (conexión a internet)</option>
            <option value="Correo Electrónico">Correo electrónico</option>
            <option value="Otro">Otro</option>
          </select>

          <button type="submit" className="btn-enviar">Enviar Ticket</button>
        </form>
      </section>

      <section className="tickets-section">
        <h3>Mis Tickets</h3>
        {tickets.length === 0 ? (
          <p>No has creado tickets aún.</p>
        ) : (
          <ul className="ticket-list">
            {tickets.map((ticket) => (
              <li key={ticket.id} className={`ticket-card ${ticket.estado.toLowerCase()}`}>
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
      </section>
    </div>
  );
}

export default UsuarioHome;





