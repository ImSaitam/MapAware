import './App.css';
import Map from './components/Map.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginForm } from './components/login.js';
import Register from './components/register.js';
import Profile from './components/profile.js';
import AdminPanel from './components/adminPanel.js';
import ProfileMovil from './components/profileMovil.js';
import RegisterMovil from './components/registerMovil.js';
import { LoginFormMovil } from './components/loginMovil.js';


export default function App() {
  
    return (
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Map />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/ProfileMovil" element={<ProfileMovil />} />
              <Route path="/RegisterMovil" element={<RegisterMovil />} />
              <Route path="/loginMovil" element={<LoginFormMovil />} />
              
            </Routes>
        </BrowserRouter>
  );
}