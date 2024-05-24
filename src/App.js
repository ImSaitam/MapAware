import './App.css';
import Map from './components/Map.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginForm } from './components/login.js';
import Register from './components/register.js';
import Profile from './components/profile.js';
import AdminPanel from './components/adminPanel.js';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Map />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<AdminPanel />} />
            </Routes>
        </BrowserRouter>
  );
}