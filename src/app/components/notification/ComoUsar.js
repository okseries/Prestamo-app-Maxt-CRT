import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';

const [notificationOpen, setNotificationOpen] = useState(false);
const [notificationMessage, setNotificationMessage] = useState('');
const [notificationSeverity, setNotificationSeverity] = useState('');

const showNotification = (message, severity) => {
  setNotificationMessage(message);
  setNotificationSeverity(severity);
  setNotificationOpen(true);
};

const closeNotification = (_, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setNotificationOpen(false);
};

showNotification('El usuario ha sido creado!', 'success');

<CustomizedSnackbars
  open={notificationOpen}
  message={notificationMessage}
  severity={notificationSeverity}
  handleClose={closeNotification}
/>;
