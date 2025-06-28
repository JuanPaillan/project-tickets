import { useNavigate } from 'react-router-dom';

function UsuarioHome() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <h2>Bienvenido, Funcionario</h2>
      <button onClick={cerrarSesion}>Cerrar sesión</button>
      {/* Aquí puedes agregar el formulario de tickets */}
    </div>
  );
}

export default UsuarioHome;
