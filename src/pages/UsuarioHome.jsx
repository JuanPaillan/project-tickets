import './UsuarioHome.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
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

      const obtenerDatosUsuario = async () => {
        const q = query(collection(db, 'usuarios'), where('correo', '==', usuario.email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const datos = snapshot.docs[0].data();
          localStorage.setItem('nombre', datos.nombre);
          localStorage.setItem('apellido', datos.apellido);
        }
      };

      obtenerDatosUsuario();

      const qTickets = query(
        collection(db, 'tickets'),
        where('correoUsuario', '==', usuario.email)
      );

      const unsubscribe = onSnapshot(qTickets, (querySnapshot) => {
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
        nombre: localStorage.getItem('nombre'),
        apellido: localStorage.getItem('apellido'),
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
        <h2>Bienvenido/a</h2>
        <button className="logout-button" onClick={cerrarSesion}>Cerrar sesión</button>
      </div>

          <section className="faq-section">
      <h3>Problemas Frecuentes</h3>
      <h4>Antes de enviar tu solicitud revisa esta seccion para que puedas solucionar tus problemas mas frecuentes</h4>

      <div className="faq-item">
        <details>
          <summary>🖨️ La impresora no imprime</summary>
          <p>Si tu impresora no responde al enviar documentos, sigue estos pasos:</p>
          <ol>
            <li><strong>Verifica que la impresora esté conectada</strong> correctamente a la corriente y encendida.</li>
            <li><strong>Comprueba el cable USB</strong> o la conexión Wi-Fi según corresponda.</li>
            <li><strong>Verifica que haya papel y tinta</strong> o tóner disponible.</li>
            <li><strong>Busca en tu equipo “Dispositivos e impresoras”</strong> y asegúrate de que la impresora esté predeterminada.</li>
            <li><strong>Reinicia el equipo</strong> y vuelve a intentarlo.</li>
            <li><strong>Si el problema persiste,</strong> crea tu ticket y solicita nuestra ayuda.</li>
          </ol>
        </details>
      </div>

      <div className="faq-item">
        <details>
          <summary>🌐 No tengo conexión a Internet</summary>
          <p>Para identificar problemas de red, sigue estos pasos:</p>
          <ol>
            <li><strong>Verifica si el cable de red está bien conectado</strong> o si estás conectado a la red Wi-Fi municipal.</li>
            <li><strong>Confirma si otros equipos también tienen el mismo problema.</strong></li>
            <li><strong>Reinicia el router</strong> (solo si estás autorizado).</li>
            <li><strong>Haz clic en el icono de red</strong> en la barra inferior y selecciona “Solucionar problemas”.</li>
            <li><strong>Si el problema persiste,</strong> crea tu ticket y solicita nuestra ayuda.</li>
          </ol>
        </details>
      </div>

      <div className="faq-item">
        <details>
          <summary>✉️ No puedo enviar correos</summary>
          <p>Si tu correo institucional presenta problemas al enviar mensajes:</p>
          <ol>
            <li><strong>Revisa tu conexión a Internet.</strong></li>
            <li><strong>Evita archivos adjuntos muy pesados</strong> (más de 20 MB pueden bloquear el envío).</li>
            <li><strong>Cierra y vuelve a abrir el programa o sitio web</strong> de correo.</li>
            <li><strong>Asegúrate de que estás usando tu cuenta municipal correctamente.</strong></li>
            <li><strong>Verifica que no tengas mensajes “atascados” en la bandeja de salida.</strong></li>
          </ol>
        </details>
      </div>

      <div className="faq-item">
        <details>
          <summary>💾 El computador está lento</summary>
          <p>Para mejorar el rendimiento de tu equipo:</p>
          <ol>
            <li><strong>Cierra los programas que no estés usando.</strong></li>
            <li><strong>No abras demasiadas pestañas en el navegador.</strong></li>
            <li><strong>Reinicia tu equipo si lleva mucho tiempo encendido</strong> y guarda todo trabajo que estes realizando.</li>
            <li><strong>Limpia y/o ordena el escritorio y la carpeta de descargas.</strong></li>
            <li><strong>Solicita soporte creando tu ticket si el problema persiste tras aplicar estos pasos.</strong></li>
          </ol>
        </details>
      </div>
    </section>

      <section className="formulario-section">
        <h3>Crear Nuevo Ticket</h3>
        <form onSubmit={manejarEnvio} className="ticket-form">
          <label>Título del problema</label>
          <input
            type="text"
            placeholder="Ej: No puedo imprimir"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <label>Describe tu problema</label>
          <textarea
            placeholder="Explica brevemente lo que ocurre"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={4}
          />

          <label>Prioridad</label>
          <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
            <option value="Alta">Alta (urgente)</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          <label>Categoría del problema</label>
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





