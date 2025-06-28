import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminHome from "./pages/AdminHome";
import UsuarioHome from "./pages/UsuarioHome";
import RutaProtegida from "./components/RutaProtegida";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <RutaProtegida rolPermitido="admin">
              <AdminHome />
            </RutaProtegida>
          }
        />

        <Route
          path="/usuario"
          element={
            <RutaProtegida rolPermitido="empleado">
              <UsuarioHome />
            </RutaProtegida>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

