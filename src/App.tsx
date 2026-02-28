import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Layout
import Layout from "./Layout";

// Placeholder Pages
import Fase1Home from "./pages/Fase1Home";
import Fase2Portal from "./pages/Fase2Portal";
import Fase3Dashboard from "./pages/Fase3Dashboard";
import Fase4SaaS from "./pages/Fase4SaaS";
import FormExecutor from "./pages/FormExecutor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Fase1Home />} />
          <Route path="constructor/*" element={<Fase2Portal />} />
          <Route path="analitica/*" element={<Fase3Dashboard />} />
          <Route path="saas/*" element={<Fase4SaaS />} />
          <Route path="execute/:id" element={<FormExecutor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
