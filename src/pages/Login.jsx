import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!usuario || !contrasena) {
      setError('Debes ingresar correo y contraseña');
      setLoading(false);
      return;
    }

    try {
      const credenciales = await signInWithEmailAndPassword(auth, usuario, contrasena);
      const correo = credenciales.user.email;

      if (correo === 'juan.admin23@municipalidad.cl') {
        localStorage.setItem('rol', 'admin');
        navigate('/admin');
      } else {
        localStorage.setItem('rol', 'empleado');
        navigate('/usuario');
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('El correo no está registrado');
      } else if (error.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta');
      } else {
        setError('Error al iniciar sesión');
      }
    }

    setLoading(false);
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
          type="email"
          placeholder="Correo Municipal"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : "Ingresar"}
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;









