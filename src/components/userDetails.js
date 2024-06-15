import { useState, useEffect } from 'react';
import axios from 'axios';
import "../userdetails.css";
import { useParams } from 'react-router-dom';
import { config } from "./config.js";
import { Link } from 'react-router-dom';

const UserDetails = () => {
  const { username } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [expandedEventId, setExpandedEventId] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${config}/user/details/${username}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        console.log(response)
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, [username]);

  const toggleEventDetails = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  return (
    <div className='container-details'>
        <div className='container'>
        <Link to={"/"}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M14.53 7.53a.75.75 0 0 0-1.06-1.06l-5 5a.75.75 0 0 0 0 1.06l5 5a.75.75 0 1 0 1.06-1.06L10.06 12l4.47-4.47Z"/>
            <path fillRule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75 22.75 17.937 22.75 12 17.937 1.25 12 1.25ZM2.75 12a9.25 9.25 0 1 1 18.5 0 9.25 9.25 0 0 1-18.5 0Z"/>
          </svg>
        </Link>
            <img src={userDetails.profileImage ? config + userDetails.profileImage : "profileImages/default-profile.png"} className='profileImage' alt='foto de perfil' />
      <p>Nombre de usuario: {userDetails.username}</p>
      <p>Eventos:</p>
        <ul>
          {userDetails.events && userDetails.events.map((event, index) => {
            const eventDateTime = new Date(event.dateTime);
            const formattedDateTime = eventDateTime.toLocaleString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            const isExpanded = expandedEventId === event.id;
            return (
              <li key={index}>
                <div className="event-header">
                  <span>{event.category}</span>
                  <span className="event-description">{event.description.length > 40 ? `${event.description.slice(0, 40)}...` : event.description}</span>
                  
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
        </div>
    </div>
  );
};

export default UserDetails;