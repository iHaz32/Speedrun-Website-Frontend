import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import Submit from "./pages/Submit";
import Admin from "./pages/Admin";
import Games from "./pages/Games";
import Submissions from "./pages/Submissions";
import MySubmissions from "./pages/MySubmissions";
import DisplayingSpeedrun from "./pages/DisplayingSpeedrun";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/mysubmissions" element={<MySubmissions />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/games" element={<Games />} />
        <Route path="/admin/submissions" element={<Submissions />} />
        <Route path="/speedrun" element={<DisplayingSpeedrun />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
