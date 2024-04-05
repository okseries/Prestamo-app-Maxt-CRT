import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import Formatter from 'app/components/Formatter/Formatter';
import { Typography } from '@mui/material';

const BASE_URL = 'http://localhost:8080/api/v1/prestamos/vencidos/sucursal/1';

const PrestamosList = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(null);

  useEffect(() => {
    const obtenerPrestamos = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        const { data } = await axiosInstance.get(BASE_URL);
        setPrestamos(data);
      } catch (error) {
        console.error('Error al obtener prestamos:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerPrestamos();
  }, []);

  const rowExpansionTemplate = (rowData) => {
    return (
      <>
        <>
          <Typography variant="subtitle1" align="left" gutterBottom>
            Cuotas
          </Typography>
          <DataTable value={rowData.cuotas} className="p-datatable-striped">
            <Column align="center" field="idCuota" header="ID De la Cuota" sortable />
            <Column align="center" field="numeroCuota" header="Número de Cuota" sortable />
            <Column
              align="center"
              field="fechaCuota"
              header="Fecha de Vencimiento"
              sortable
              body={(rowData) => <Formatter value={rowData.fechaCuota} type="date" />}
            />
          </DataTable>
        </>
      </>
    );
  };

  return (
    <>
      <DataTable
        value={prestamos}
        loading={loading}
        paginator
        rows={10}
        responsive
        rowExpansionTemplate={rowExpansionTemplate}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        emptyMessage="No se encontraron datos."
      >
        <Column align="center" expander style={{ width: '3em' }} />
        <Column align="center" field="idPrestamo" header="ID Préstamo" sortable />
        <Column
          align="center"
          field="cliente.primerNombre"
          header="Nombre del Cliente"
          body={(rowData) => (
            <>
              {rowData.cliente.primerNombre} {rowData.cliente.apellidoPaterno}
            </>
          )}
          sortable
        />
        <Column align="center" field="cliente.identificacion" header="Identificación" sortable />
        <Column
          align="center"
          field="cuotas"
          header="Cantidad de Cuotas"
          body={(rowData) => rowData.cuotas.length}
          sortable
        />
      </DataTable>
    </>
  );
};

export default PrestamosList;
