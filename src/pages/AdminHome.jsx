import { useNavigate } from 'react-router-dom';

function AdminHome() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <h2>Bienvenido, Administrador</h2>
      <button onClick={cerrarSesion}>Cerrar sesión</button>
      {/* Aquí puedes agregar más contenido del panel */}
    </div>
  );
}

export default AdminHome;
