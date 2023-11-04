import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import ErrorBlock from '../../components/UI/ErrorBlock.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvent } from '../../utils/service.js';

export default function EventDetails() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => fetchEvent(eventId),
  });

  const { mutate } = useMutation({
    queryFn: () => deleteEvent(eventId),
    onSuccess: () => {
      navigate('/events');
    },
  });

  function handleDelete() {
    mutate();
  }

  let content;

  if (isLoading) {
    content = (
      <div id='event-details-content' className='center'>
        <p>Fetching event data...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <div id='event-details-content' className='center'>
        <ErrorBlock
          title='failed to load event'
          message={
            error.info?.message ||
            'failed to fetch event details, please try again'
          }
        />
      </div>
    );
  }

  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    content = (
      <>
        <header>
          <h1>EVENT TITLE</h1>
          <nav>
            <button onClick={handleDelete}>Delete</button>
            <Link to='edit'>Edit</Link>
          </nav>
        </header>

        <div id='event-details-content'>
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id='event-details-info'>
            <div>
              <p id='event-details-location'>{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {formattedDate} @ {data.time}
              </time>
            </div>
            <p id='event-details-description'>{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to='/events' className='nav-item'>
          View all Events
        </Link>
      </Header>
      <article id='event-details'>{content}</article>
    </>
  );
}
