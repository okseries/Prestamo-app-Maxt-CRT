// FinancingPrintComponent.js
import { Print } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react';

const FinancingPrintComponent = ({ row }) => {
  const handlePrintClick = () => {
    const printContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Detalle del Prestamo</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
      
              h2, h3 {
                color: #333;
                border-bottom: 2px solid #333;
                padding-bottom: 5px;
              }
      
              strong {
                color: #555;
              }
      
              .info-section {
                margin-bottom: 20px;
              }
      
              .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
              }
            </style>
          </head>
          <body>
            <h2>REcomunicaciones</h2>
      
            <h3>Detalles del Prestamo</h3>
      
            <div class="info-section">
              <strong>Identificación:</strong> ${row.cliente.identificacion}<br>
              <strong>Nombre:</strong> ${row.cliente.primerNombre} ${
      row.cliente.apellidoPaterno
    }<br>
              <strong>Teléfono:</strong> ${row.cliente.telefono}
            </div>
      
            <h3>Información del Dinero</h3>
      
            <div class="info-section">
              <strong>Capital:</strong> ${row.capital}<br>
              <strong>Monto:</strong> ${row.monto}<br>
              <strong>Monto restante:</strong> ${row.montoRestante}<br>
              <strong>Tasa:</strong> ${row.tasaPorcentaje}<br>
              <strong>Tiempo:</strong> ${row.tiempo}<br>
              <strong>Fecha inicio:</strong> ${row.fechaInicio}<br>
              ${!row.estado ? `<strong>Fecha fin:</strong> ${row.fechaFin}<br>` : ''}
              <strong>Estado:</strong> ${row.estado ? 'Activo' : 'Finalizado'}
            </div>
      
            <div class="footer">
              <p>Este documento es una representación impresa de los detalles del prestamo.</p>
            </div>
          </body>
          </html>
        `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <IconButton className="m-1" color="info" onClick={handlePrintClick}>
      <Print />
    </IconButton>
  );
};

export default FinancingPrintComponent;
