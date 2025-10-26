import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import EditPage from "./pages/EditPage";
import LandingPage from "./pages/LandingPage";
import ComponentsPage from "./pages/ComponentsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/edit/:uuid" element={<EditPage />} />
        <Route path="/components" element={<ComponentsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
