import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

function Login() {
  //estados para capturar correo, contraseña, errores y carga
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //funcion que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    //validacion simple que los campos no esten vacios
    if (!usuario || !contrasena) {
      setError('Debes ingresar correo y contraseña');
      setLoading(false);
      return;
    }

    try { //firebase auth inicia sesion con correo y contraseña 
      const credenciales = await signInWithEmailAndPassword(auth, usuario, contrasena);
      const correo = credenciales.user.email;

      //asigna el correo como administrador 
      if (correo === 'juan.admin23@municipalidad.cl') {
        localStorage.setItem('rol', 'admin');
        navigate('/admin'); //redirige al home del administrador
      } else {
        localStorage.setItem('rol', 'empleado');
        navigate('/usuario'); //redirige al home del usuario
      }
    } catch (error) { //maneja errores personalizados en firebase auth
      const code = error.code; 
      if (code === 'auth/user-not-found') {
        setError('El correo no está registrado');
      } else if (code === 'auth/wrong-password') {
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
      <h1 className="login-titulo">Bienvenido/a al Portal de Soporte Informático Municipalidad de Chonchi</h1>
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









