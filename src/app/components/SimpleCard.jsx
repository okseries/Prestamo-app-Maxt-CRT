import { Card, IconButton } from '@mui/material';
import { Box, styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';

const CardRoot = styled(Card)(() => ({
  height: '100%',
  padding: '20px 24px',
  position: 'relative', // Added to enable absolute positioning for the close button
}));

const CardTitle = styled('div')(({ subtitle }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: 'capitalize',
  marginBottom: !subtitle && '16px',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '8px',
  right: '8px',
  [theme.breakpoints.down('sm')]: {
    top: '4px',
    right: '4px',
  },
}));

const SimpleCard = ({ children, title, subtitle, icon, onClose }) => {
  return (
    <CardRoot elevation={6}>
      <CardTitle subtitle={subtitle}>
        {title}
        {onClose && (
          <CloseButton color="error" onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        )}
      </CardTitle>
      {subtitle && <Box sx={{ mb: 2 }}>{subtitle}</Box>}
      {children}
    </CardRoot>
  );
};

export default SimpleCard;
