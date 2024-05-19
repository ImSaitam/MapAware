import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "../profile.css";
import axios from 'axios';
import { Button } from 'react-bootstrap';

function deleteToken() { 
  localStorage.removeItem('token')
  alert("Sesion cerrada con exito.")
}

function deleteEvent(eventId, navigate, setUser, event) {
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/');
    return;
  }

  axios.delete(`http://localhost:8080/event/delete/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
 .then(response => {
    // Actualiza el estado con los datos del usuario sin el evento borrado
    setUser(prevUser => {
      return {
       ...prevUser,
        events: prevUser.events.filter(eventToDelete => eventToDelete.id!== eventId)
      }
    });
  })
 .catch(error => {
    // Maneja el error
  });
  console.log("Evento borrado con exito.")
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({}); // Estado para guardar los datos del usuario


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    axios.get('http://localhost:8080/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
   .then(response => {
        const userData = response.data;
        setUser(userData); // Actualiza el estado con los datos del usuario
      })
   .catch(error => {
        // Maneja el error
      });
  }, [navigate]);

  return (
    <div>
      <Link to={"/"}>
        <img src="https://simpleicon.com/wp-content/uploads/map-8.svg" alt='icono' className='iconImage'></img>
      </Link>
      <h2>Perfil del usuario</h2>
      <p>Nombre de usuario: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Eventos:</p>
      <ul>
      {user.events && user.events.map((event, index) => {
        const eventDateTime = new Date(event.dateTime);
        const formattedDateTime = eventDateTime.toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        return (
          <li key={index}>
            <p>Fecha y hora: {formattedDateTime}</p>
            <p>Descripción: {event.description}</p>
            <p>Categoría: {event.category}</p>
            <Button variant="outline-warning" className='deleteButton' onClick={() => deleteEvent(event.id, navigate, setUser, event)}>Borrar evento</Button>
          </li>
        )
      })}
    </ul>
      <Link variant='warning' to={"/"} onClick={deleteToken}>Cerrar sesión</Link>
    </div>
  )
}