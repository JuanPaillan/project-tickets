import { Navigate } from "react-router-dom";

function RutaProtegida({ children, rolPermitido }) {
  const rolGuardado = localStorage.getItem("rol");

  if (!rolGuardado) {
    return <Navigate to="/" replace />;
  }

  if (rolGuardado !== rolPermitido) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;
