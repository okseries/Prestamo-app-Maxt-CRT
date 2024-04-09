import React, { useState } from 'react';
import { Modal } from 'reactstrap';
import { SimpleCard } from '..';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { Done } from '@mui/icons-material';

const ModalOption = ({
  action,
  Icono,
  titleCard,
  Title,
  color,
  handleModalOptionOK,
  closeModalOption,
  disabled,
  size,
}) => {
  const [isModalOpenModalOption, setIsModalOpenModalOption] = useState(false);

  const closeModal = () => {
    setIsModalOpenModalOption(false);
  };

  const handleClickOk = () => {
    handleModalOptionOK();
    closeModal();
  };

  return (
    <>
      <Tooltip title={Title}>
        <IconButton
          size={size}
          disabled={disabled}
          color={color}
          onClick={() => setIsModalOpenModalOption(true)}
        >
          {Icono}
        </IconButton>
      </Tooltip>

      <Modal all backdrop="static" className="modal-lx focus" isOpen={isModalOpenModalOption}>
        <SimpleCard
          title={titleCard}
          subtitle={`¿Estás seguro de que quieres ${action}?`}
          onClose={() => closeModal()}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClickOk} color="primary" startIcon={<Done />}>
              Ok
            </Button>
          </Box>
        </SimpleCard>
      </Modal>
    </>
  );
};

export default ModalOption;
