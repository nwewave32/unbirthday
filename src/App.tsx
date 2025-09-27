import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import EditPage from "./pages/EditPage";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/edit" element={<EditPage />} />
      </Routes>
    </Router>
  );
}

export default App;
