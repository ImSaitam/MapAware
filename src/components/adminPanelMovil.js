import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../adminPanelMovil.css";
import axios from 'axios';
import { Button } from 'react-bootstrap';
import config from './config.js';

function deleteEvent(eventId, navigate, setUser, event) {
  const token = localStorage.getItem('token');

  axios.delete(`${config.Url}/event/delete/${eventId}`, {
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
      console.log("Evento borrado con éxito.");
    })
    .catch(error => {
      console.error("Error al borrar el evento:", error);
    });
}

export default function AdminPanelMovil() {
  const navigate = useNavigate();
  const [user, setUser] = useState({}); // Estado para guardar los datos del usuario
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [page, setPage] = useState(0);

  const toggleEventDetails = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await axios.get(`${config.Url}user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const user = response.data;
      if (!user.role.includes('ADMIN')) {
        navigate('/');
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      navigate('/');
      return;
    }
  
    axios.get(`${config.Url}/event/all-pag?pag=${page}&cant=5`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
     .then(response => {
        const userData = response.data;
        setUser(prevUser => {
          return {
           ...prevUser,
            events: userData
          }
        });
      })
     .catch(error => {
        console.error("Error fetching events:", error);
      });
  }, [page, navigate]);

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  return (
    <div className="profile-admin-container">
      <div className="container-admin">
        <Link to={"/"}>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
            <path d="M14.53 7.53a.75.75 0 0 0-1.06-1.06l-5 5a.75.75 0 0 0 0 1.06l5 5a.75.75 0 1 0 1.06-1.06L10.06 12l4.47-4.47Z"/>
            <path fillRule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75 22.75 17.937 22.75 12 17.937 1.25 12 1.25ZM2.75 12a9.25 9.25 0 1 1 18.5 0 9.25 9.25 0 0 1-18.5 0Z"/>
          </svg>
        </Link>
        <h1>Panel administrador</h1>
        <br></br>
        <p className='event-title'>Eventos:</p>
        <ul className="event-list-admin">
          {user.events && user.events.length > 0 ? (
            user.events.map((event, index) => {
              const eventDateTime = new Date(event.dateTime);
              const formattedDateTime = eventDateTime.toLocaleString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
              const isExpanded = expandedEventId === event.id;
              return (
                <li key={index} className="event-item-admin">
                  <div className="event-header-admin">
                    <span> ID del evento: {event.id}</span>
                    <div className="event-buttons">
                      <button className="trashButton" onClick={() => deleteEvent(event.id, navigate, setUser, event)}>🗑️</button>
                      <button className="toggleButton" onClick={() => toggleEventDetails(event.id)}>
                        {isExpanded ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>
                  <div className={`event-details-admin ${isExpanded ? 'expanded' : ''}`}>
                    <p><strong>ID:</strong> {event.id}</p>
                    <p><strong>Nombre de usuario:</strong> {event.username}</p>
                    <p><strong>Fecha y hora:</strong> {formattedDateTime}</p>
                    <p><strong>Categoría:</strong> {event.category}</p>
                    <p><strong>Descripción:</strong> {event.description}</p>
                  </div>
                </li>
              )
            })
          ) : (
            <p>No hay eventos disponibles</p>
          )}
        </ul>
        <div className="pagination d-flex justify-content-between">
          <Button variant="outline-primary" onClick={handlePrevPage} disabled={page === 0}>
            &#x2190; Anterior
          </Button>
          <span>Página {page + 1}</span>
          <Button variant="outline-primary" onClick={handleNextPage}>
            Siguiente &#x2192;
          </Button>
        </div>
      </div>
    </div>
  )
}
