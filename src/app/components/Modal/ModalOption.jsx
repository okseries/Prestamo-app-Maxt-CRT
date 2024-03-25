import React, { useState } from 'react';
import { Modal } from 'reactstrap';
import { SimpleCard } from '..';
import { Box, Button } from '@mui/material';
import { Done } from '@mui/icons-material';

const ModalOption = ({ action, startIcon, TextBtn, title, disabled, handleModalOptionOK }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button
        size="large"
        onClick={() => setIsModalOpen(true)}
        startIcon={startIcon}
        disabled={disabled}
      >
        {TextBtn}
      </Button>
      <Modal all backdrop="static" className="modal-lx focus" isOpen={isModalOpen}>
        <SimpleCard
          title={title}
          subtitle={`¿Estás seguro de que quieres ${action}?`}
          onClose={() => closeModal()}
        >
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

export default ModalOption;
