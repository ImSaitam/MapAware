import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../profile.css";
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import {config} from './config.js';
import ChangeProfileImage from './changeImage.js';
import editLogo from '../images/edit.svg';

function deleteToken() {
  localStorage.removeItem('token');
}

function deleteEvent(eventId, navigate, setUser, event) {
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/');
    return;
  }

  axios.delete(`${config}/event/delete/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      setUser(prevUser => {
        return {
          ...prevUser,
          events: prevUser.events.filter(eventToDelete => eventToDelete.id !== eventId)
        }
      });
    })
    .catch(error => {
      // Maneja el error
    });
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({}); // Estado para guardar los datos del usuario
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [changeImageModal, setChangeImageModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    axios.get(`${config}/user`, {
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

  const toggleEventDetails = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };
  function redirectToMobileVersion() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|blackberry|opera mini|windows mobile|palm|iemobile|symbian/i.test(userAgent);
    const mobileURL = "/profilemovil";
    if (isMobile) {
      window.location.href = mobileURL;
    }
  }
  window.onload = redirectToMobileVersion;
  

  return (
    <div className="profile-container">
      <div className="container">
        <Link to={"/"}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M14.53 7.53a.75.75 0 0 0-1.06-1.06l-5 5a.75.75 0 0 0 0 1.06l5 5a.75.75 0 1 0 1.06-1.06L10.06 12l4.47-4.47Z"/>
            <path fillRule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75 22.75 17.937 22.75 12 17.937 1.25 12 1.25ZM2.75 12a9.25 9.25 0 1 1 18.5 0 9.25 9.25 0 0 1-18.5 0Z"/>
          </svg>
        </Link>
        <h2>Perfil del usuario</h2>
        <div className='image-container'>
          <img src={user.profileImage ? config + user.profileImage : "profileImages/default-profile.png"} className='profileImage' alt='foto de perfil' onClick={() => setChangeImageModal(true)}/>
          <img src={editLogo} className='editLogo' alt=''/>
        </div>
        <Modal show={changeImageModal} 
        onHide={() => setChangeImageModal(false)} >
          <Modal.Header closeButton>
            <Modal.Title>
              Cambiar imagen de perfil
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ChangeProfileImage 
                onChangeImage={() => { setChangeImageModal(false); }} // Cierra el modal al cambiar la imagen
                setChangeImageModal={setChangeImageModal} // Pasa la función para cambiar el estado del modal
            />
          </Modal.Body>
        </Modal>
        <p>Nombre de usuario: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Eventos:</p>
        <ul>
          {user.events && user.events.map((event, index) => {
            const eventDateTime = new Date(event.dateTime);
            const formattedDateTime = eventDateTime.toLocaleString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            const isExpanded = expandedEventId === event.id;
            return (
              <li key={index}>
                <div className="event-header">
                  <span>{event.category}</span>
                  <span className="event-description">{event.description.length > 20 ? `${event.description.slice(0, 20)}...` : event.description}</span>
                  <Button variant="outline-none" className='trashButton' onClick={() => deleteEvent(event.id, navigate, setUser, event)}>🗑️</Button>
                  <Button variant="outline-danger" className='deleteButton' onClick={() => deleteEvent(event.id, navigate, setUser, event)}>Borrar evento</Button>
                  
                  <button className='toggleButton' onClick={() => toggleEventDetails(event.id)}>
                    {isExpanded ? '▲' : '▼'}
                  </button>
                </div>
                <div className={`event-details ${isExpanded ? 'expanded' : ''}`}>
                  <p><strong>Fecha y hora:</strong> {formattedDateTime}</p>
                  <p><strong>Categoría:</strong> {event.category}</p>
                  <p><strong>Descripción:</strong> {event.description}</p>
                </div>
              </li>
            )
          })}
        </ul>
        <button className="btn btn-danger logout-button-" onClick={() => { deleteToken(); window.location.href = "/"; }}>Cerrar sesión</button>
      </div>
    </div>
  )
}
