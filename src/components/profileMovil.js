import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../profileMovil.css";  // Importar el CSS específico para móviles
import { Pagination } from 'react-bootstrap'; // Importar el componente de paginación de Bootstrap
import { Modal } from 'react-bootstrap';
import ChangeProfileImage from './changeImage.js';

function deleteToken() {
  localStorage.removeItem('token');
  alert("Sesión cerrada con éxito.");
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
  console.log("Evento borrado con éxito.");
}

export default function ProfileMovil() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [changeImageModal, setChangeImageModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Número de elementos por página inicial

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
        setUser(userData);
      })
      .catch(error => {
        // Maneja el error
      });
  }, [navigate]);

  useEffect(() => {
    const screenHeight = window.screen.height;
    if (screenHeight > 890 ) {
      setItemsPerPage(8);
    } else {
      setItemsPerPage(4); 
    }
  }, []);
  const toggleEventDetails = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedEvents = user.events?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const showPagination = user.events && user.events.length > itemsPerPage;

  return (
    <div className="profile-movil-container">
      <div className="container">
        <Link to={"/"}>
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
            <path d="M14.53 7.53a.75.75 0 0 0-1.06-1.06l-5 5a.75.75 0 0 0 0 1.06l5 5a.75.75 0 1 0 1.06-1.06L10.06 12l4.47-4.47Z"/>
            <path fillRule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75 22.75 17.937 22.75 12 17.937 1.25 12 1.25ZM2.75 12a9.25 9.25 0 1 1 18.5 0 9.25 9.25 0 0 1-18.5 0Z"/>
          </svg>
        </Link>
        <br></br>      
        <img src={user.profileImage ? "http://localhost:8080" + user.profileImage : "profileImages/default-profile.png"} className='profileImage' alt='foto de perfil' onClick={() => setChangeImageModal(true)}/>
        <h2>Perfil del usuario</h2>
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
        {user.events && user.events.length > 0 ? (
          <>
            <ul className="event-list">
              {paginatedEvents.map((event, index) => {
                const eventDateTime = new Date(event.dateTime);
                const formattedDateTime = eventDateTime.toLocaleString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                const isExpanded = expandedEventId === event.id;
                return (
                  <li key={index} className="event-item">
                    <div className="event-header">
                      <span>{event.category}</span>
                      <div className="event-buttons">
                        <button className="trashButton" onClick={() => deleteEvent(event.id, navigate, setUser, event)}>🗑️</button>
                        <button className="toggleButton" onClick={() => toggleEventDetails(event.id)}>
                          {isExpanded ? '▲' : '▼'}
                        </button>
                      </div>
                    </div>
                    <div className={`event-details ${isExpanded ? 'expanded' : ''}`}>
                      <p><strong>Fecha y hora:</strong> {formattedDateTime}</p>
                      <p><strong>Categoría:</strong> {event.category}</p>
                      <p><strong>Descripción:</strong> {event.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p>No hay eventos disponibles.</p>
        )}
{showPagination && (
          <Pagination className="pagination-container">
            {Array.from({ length: Math.ceil(user.events.length / itemsPerPage) }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        )}
        <button className="btn btn-outline-danger logout-button" onClick={() => { deleteToken(); window.location.href = "/"; }}>Cerrar sesión</button>
      </div>
    </div>
  );
}
