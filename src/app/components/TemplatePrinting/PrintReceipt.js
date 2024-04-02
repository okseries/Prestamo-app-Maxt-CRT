import { Print } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react';

const PrintReceipt = ({ detallePago, detallePagoCuota }) => {
  const { cliente, idDetallePago, montoPagado, fechaPago } = detallePago;
  const cuotasPagadas = detallePagoCuota.map((cuota) => ({
    numeroCuota: cuota.numeroCuota,
    montoCuota: cuota.montoCuota,
  }));

  const formattedMontoPagado = montoPagado.toLocaleString('es-DO', {
    style: 'currency',
    currency: 'DOP',
  });

  const formattedFechaPago = new Date(fechaPago).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const printContent = `
    --------------------------------
            REcomunicaciones        
    --------------------------------
    --------------------------------
           COMPROBANTE DE PAGO      
    --------------------------------
    --------------------------------
    Cliente: ${cliente.primerNombre} ${cliente.apellidoPaterno}
    --------------------------------
    ID de pago: ${idDetallePago}
    Monto del pago: ${formattedMontoPagado}
    --------------------------------
    Cuotas Pagadas:
    ${cuotasPagadas
      .map(
        (cuota) => `
      - Cuota número: ${cuota.numeroCuota}
        Monto: ${cuota.montoCuota.toLocaleString('es-DO', {
          style: 'currency',
          currency: 'DOP',
        })}
      `
      )
      .join('')}
    --------------------------------
        ${formattedFechaPago}
    --------------------------------
  `;

  const printDocument = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>${cliente.primerNombre}</title></head><body>`);
    printWindow.document.write(`<pre>${printContent}</pre>`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <IconButton onClick={printDocument}>
      <Print color={'primary'} />
    </IconButton>
  );
};

export default PrintReceipt;
