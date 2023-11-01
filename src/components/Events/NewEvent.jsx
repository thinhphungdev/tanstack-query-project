import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { createNewEvent } from '../../utils/service.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { queryClient } from '../../utils/service.js';

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      navigate('/events');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isLoading && 'submitting...'}
        {!isLoading && (
          <>
            <Link to='../' className='button-text'>
              Cancel
            </Link>
            <button type='submit' className='button'>
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title='failed to create event'
          message={
            error?.info?.message ||
            'Failed to create event. Please check your inputs and try again later.'
          }
        />
      )}
    </Modal>
  );
}
