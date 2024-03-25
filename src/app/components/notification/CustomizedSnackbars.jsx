// CustomizedSnackbars.js

import { Alert, Snackbar } from '@mui/material';
import { amber, green } from '@mui/material/colors';
import { styled } from '@mui/system';
import React from 'react';

const ContentRoot = styled('div')(({ theme }) => ({
  '& .icon': { fontSize: 20 },
  '& .success': { backgroundColor: green[100] },
  '& .warning': { backgroundColor: amber[700] },
  '& .error': { backgroundColor: theme.palette.error.main },
  '& .info': { backgroundColor: theme.palette.primary.main },
  '& .iconVariant': { opacity: 0.9, marginRight: theme.spacing(1) },
  '& .message': { display: 'flex', alignItems: 'center' },
  '& .margin': { margin: theme.spacing(1) },
}));

const CustomizedSnackbars = ({ open, message, severity, handleClose }) => {
  return (
    <ContentRoot>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }} variant="outlined">
          {message}
        </Alert>
      </Snackbar>
    </ContentRoot>
  );
};

export default CustomizedSnackbars;
