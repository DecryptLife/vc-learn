import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
