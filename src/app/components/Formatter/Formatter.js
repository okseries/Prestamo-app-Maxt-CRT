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

  const formatCurrency = (number) => {
    return `$ ${number}`;
  };

  const formatPercentage = (number) => {
    return `${number}%`;
  };

  return (
    <>
      {type === 'date' && formatDate(value)}
      {type === 'dateUTC' && formatDateUTC(value)}
      {type === 'currency' && formatCurrency(value)}
      {type === 'percentage' && formatPercentage(value)}
    </>
  );
};

export default Formatter;
