// BarChart.js
import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Box, Grid, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { Input } from 'reactstrap';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';

const PAGE_SIZE = 10;

const BarChart = ({ height, data }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filterDataByDate = () => {
      const filteredData = data.filter((item) => {
        const paymentDate = new Date(item.fecha);
        return (
          startDate === '' ||
          endDate === '' ||
          (paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate))
        );
      });
      setFilteredData(filteredData);
    };

    filterDataByDate();
  }, [startDate, endDate, data]);

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

  if (!filteredData.length) {
    return <div>No hay datos disponibles para mostrar.</div>;
  }

  const clientData = filteredData.reduce((acc, item) => {
    const clientName = item.cliente; // Ajustar a la propiedad correcta en tus datos
    acc[clientName] = acc[clientName] || 0;

    if (item.estado === 'Pagado') {
      acc[clientName] += item.monto;
    }

    return acc;
  }, {});

  const paginatedClients = Object.keys(clientData).slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const xAxisData = paginatedClients;
  const seriesData = {
    name: 'Pagos Aplicados',
    type: 'bar',
    data: xAxisData.map((client) => clientData[client]),
  };

  const option = {
    color: '#08ad6c', // Color verde
    legend: { data: ['Pagos Aplicados'] },
    tooltip: { show: true, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: xAxisData },
    yAxis: { type: 'value' },
    series: [seriesData],
  };

  const totalPages = Math.ceil(Object.keys(clientData).length / PAGE_SIZE);

  return (
    <>
      <Grid item xs={12} md={12}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Input
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <ReactEcharts style={{ height: height }} option={option} />
      <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <IconButton
          onClick={() => setCurrentPage((prevPage) => Math.max(0, prevPage - 1))}
          disabled={currentPage === 0}
        >
          <Remove color="primary" />
        </IconButton>
        <span>
          {currentPage + 1} de {totalPages}
        </span>
        <IconButton
          onClick={() => setCurrentPage((prevPage) => Math.min(totalPages - 1, prevPage + 1))}
          disabled={currentPage === totalPages - 1}
        >
          <Add color="primary" />
        </IconButton>
      </Box>
      <CustomizedSnackbars
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        handleClose={closeNotification}
      />
    </>
  );
};

export default BarChart;
