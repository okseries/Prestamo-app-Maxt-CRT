import React from 'react';

const Formatter = ({ value, type }) => {
  const formatDateUTC = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Sumamos un día al día actual
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    const formatter = new Intl.DateTimeFormat('es-ES', options);
    return formatter.format(date);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    const formatter = new Intl.DateTimeFormat('es-ES', options);
    return formatter.format(date);
  };

  const formatDateUTC4 = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 4); // Restamos 4 horas a la hora actual
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    const formatter = new Intl.DateTimeFormat('es-ES', options);
    return formatter.format(date);
  };

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP', // Puedes cambiar 'USD' por el código de moneda de tu país
      minimumFractionDigits: 2,
    }).format(number);
  };

  const formatPercentage = (number) => {
    return `${number}%`;
  };

  return (
    <>
      {type === 'date' && formatDate(value)}
      {type === 'dateUTC' && formatDateUTC(value)}
      {type === 'dateUTC-4' && formatDateUTC4(value)}
      {type === 'currency' && formatCurrency(value)}
      {type === 'percentage' && formatPercentage(value)}
    </>
  );
};

export default Formatter;
