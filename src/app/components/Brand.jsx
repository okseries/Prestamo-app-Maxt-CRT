import { Box, styled } from '@mui/material';
import { MatxLogo } from 'app/components';
import useSettings from 'app/hooks/useSettings';
import { Span } from './Typography';
import axios from 'axios';
import { GetSucursalURL } from 'BaseURL';
import { useEffect, useState } from 'react';

const BrandRoot = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 18px 20px 29px',
}));

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 18,
  marginLeft: '.5rem',
  display: mode === 'compact' ? 'none' : 'block',
}));

const Brand = ({ children }) => {
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;
  const [nombreEmpresa, setNombreEmpresa] = useState();

  useEffect(() => {
    informacionEmpresa();
  }, []);

  const informacionEmpresa = async () => {
    try {
      const { data } = await axios.get(`${GetSucursalURL}`);
      setNombreEmpresa(data.nombreSucursal);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BrandRoot>
      <Box display="flex" alignItems="center">
        <MatxLogo />
        <StyledSpan mode={mode} className="sidenavHoverShow">
          {nombreEmpresa}
        </StyledSpan>
      </Box>

      <Box className="sidenavHoverShow" sx={{ display: mode === 'compact' ? 'none' : 'block' }}>
        {children || null}
      </Box>
    </BrandRoot>
  );
};

export default Brand;
