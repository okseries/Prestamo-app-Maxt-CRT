import { Print } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react';

const PrintMoraReceipt = ({ rowData }) => {
  const { cliente, idHistorialPagoMora, montoPagado, createdAt, detallePagoMora } = rowData;
  const morasPagadas = detallePagoMora.map((mora) => ({
    idMora: mora.idMora,
    montoMora: mora.montoPagado, // Usamos mora.montoPagado en lugar de mora.montoMora
    estado: mora.mora.pagada ? 'Pagada' : 'Pendiente',
    diasDeRetraso: mora.mora.diasDeRetraso, // Agregamos los días de retraso
  }));

  const formattedMontoPagado = montoPagado.toLocaleString('es-DO', {
    style: 'currency',
    currency: 'DOP',
  });

  const formattedFechaPago = new Date(createdAt).toLocaleDateString('es-ES', {
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
    ID de pago: ${idHistorialPagoMora}
    Monto del pago: ${formattedMontoPagado}
    --------------------------------
    Moras Pagadas:
    ${morasPagadas
      .map(
        (mora) => `
      - Mora ID: ${mora.idMora}
        Monto Pagado: ${mora.montoMora}
        Dias de retraso: ${mora.diasDeRetraso}
        Estado: ${mora.estado}
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

export default PrintMoraReceipt;
