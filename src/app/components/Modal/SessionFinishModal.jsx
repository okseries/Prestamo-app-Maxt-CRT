import React, { useState } from 'react';
import { Modal } from 'reactstrap';
import { SimpleCard } from '..';
import { Box, Button } from '@mui/material';
import { Done } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SessionFinishModal = ({ title, closeModalSesion, isOpen }) => {
  const navigate = useNavigate();

  const handleModalOptionOK = () => {
    navigate('/session/signin');
    closeModalSesion();
  };

  return (
    <>
      <Modal all backdrop="static" className="modal-lx focus" isOpen={isOpen}>
        <SimpleCard title={title} subtitle={`Su sesión ha finalizado, debe volver a iniciar!`}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleModalOptionOK} color="primary" startIcon={<Done />}>
              Ok
            </Button>
          </Box>
        </SimpleCard>
      </Modal>
    </>
  );
};

export default SessionFinishModal;
