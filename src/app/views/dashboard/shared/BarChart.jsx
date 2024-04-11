import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { Add, BackHand, NavigateBefore, NavigateNext, NextPlan, Remove } from '@mui/icons-material';
import { Input } from 'reactstrap';
import axios from 'axios';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';
import { HistorialPagosURL } from 'BaseURL';

const PAGE_SIZE = 10;

const BarChart = ({ height }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const response = await axiosInstance.get(HistorialPagosURL);
      setData(response.data);
    } catch (error) {
      console.error('Error al obtener los pagos:', error);
      if (error.response && error.response.status === 403) {
        alert('Debe volver a iniciar sesión');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      let filtered = data;
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filtered = data.filter((item) => {
          const paymentDate = new Date(item.createdAt);
          return paymentDate >= start && paymentDate <= end;
        });
      }
      setFilteredData(filtered);
    };
    filterData();
  }, [data, startDate, endDate]);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(0, prevPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(Math.ceil(filteredData.length / PAGE_SIZE) - 1, prevPage + 1)
    );
  };

  if (!data.length) {
    return (
      <Box>
        <Typography>No hay datos disponibles para mostrar.</Typography>
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
      </Box>
    );
  }

  const paginatedData = filteredData.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const xAxisData = paginatedData.map(
    (item) => `${item.cliente.primerNombre} - ${new Date(item.createdAt).toLocaleDateString()}`
  );
  const seriesData = {
    name: 'Pagos Aplicados',
    type: 'bar',
    data: paginatedData.map((item) => parseFloat(item.monto)),
  };

  const option = {
    color: '#08ad6c',
    legend: { data: ['Pagos Aplicados'] },
    tooltip: { show: true, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: xAxisData },
    yAxis: { type: 'value' },
    series: [seriesData],
  };

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

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
        <IconButton onClick={handlePreviousPage} disabled={currentPage === 0}>
          <NavigateBefore color="primary" />
        </IconButton>
        <span>
          {currentPage + 1} de {totalPages}
        </span>
        <IconButton onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          <NavigateNext color="primary" />
        </IconButton>
      </Box>
      <CustomizedSnackbars
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        handleClose={() => setNotificationOpen(false)}
      />
    </>
  );
};

export default BarChart;
