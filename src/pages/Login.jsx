import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const usuariosSimulados = [
    { usuario: 'admin', password: 'admin123', rol: 'admin' },
    { usuario: 'empleado', password: 'empleado123', rol: 'empleado' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarioEncontrado = usuariosSimulados.find(
      (u) => u.usuario === usuario && u.password === contrasena
    );

    if (usuarioEncontrado) {
      localStorage.setItem('rol', usuarioEncontrado.rol);
      if (usuarioEncontrado.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/usuario');
      }
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <img
        src="https://i0.wp.com/municipalidadchonchi.cl/web/wp-content/uploads/2020/07/logo-municipalidad-de-chonchi-1.png?fit=500%2C150&ssl=1"
        alt="Logo Municipalidad de Chonchi"
        className="login-logo"
      />
      <h1 className="login-titulo">Gestión de Ayuda Informática – Municipalidad de Chonchi</h1>
      <h2>Iniciar sesión</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <button type="submit">Ingresar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;


