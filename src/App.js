import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import UsuarioHome from './pages/UsuarioHome';
import AdminHome from './pages/AdminHome';
import TicketsUsuarios from './pages/TicketsUsuarios';
import ProblemasFrecuentes from './pages/ProblemasFrecuentes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/usuario" element={<UsuarioHome />} />
        <Route path="/usuario/tickets" element={<TicketsUsuarios />} />
        <Route path="/usuario/kb" element={<ProblemasFrecuentes />} />
        <Route path="/admin" element={<AdminHome />} />
      </Routes>
    </Router>
  );
}

export default App;
