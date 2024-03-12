// DoughnutChart.js
import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import TextField from '@mui/material/TextField';

const DoughnutChart = ({ height, color = [], data }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filterDataByDate = () => {
      const filteredData = data.filter((item) => {
        const paymentDate = new Date(item.fechaPago);
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

  const clientData = filteredData.reduce((acc, item) => {
    const clientName = item.financiamiento.cliente.primerNombre;
    acc[clientName] = acc[clientName] || 0;
    acc[clientName] += item.montoPago;
    return acc;
  }, {});

  const formattedData = Object.keys(clientData).map((clientName) => ({
    value: clientData[clientName],
    name: clientName,
  }));

  const option = {
    tooltip: { show: false },
    series: [
      {
        name: 'Payment Amount',
        type: 'pie',
        radius: ['45%', '72.55%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        hoverOffset: 5,
        stillShowZeroSum: false,
        label: {
          normal: {
            show: false,
            position: 'center',
            textStyle: {
              color: 'white',
              fontSize: 13,
              fontFamily: 'roboto',
            },
            formatter: '{a}',
          },
          emphasis: {
            show: true,
            textStyle: { fontSize: '14', fontWeight: 'normal' },
            formatter: '{b} \n{c} ({d}%)',
          },
        },
        labelLine: { normal: { show: false } },
        data: formattedData,
        itemStyle: {
          emphasis: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        },
      },
    ],
  };

  return (
    <div>
      <TextField
        type="date"
        label="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      <TextField
        type="date"
        label="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      <ReactEcharts style={{ height: height }} option={{ ...option, color: [...color] }} />
    </div>
  );
};

export default DoughnutChart;
