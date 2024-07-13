import * as React from 'react';
import { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function BasicTable(props) {
  let columns = [
    { field: 'rangeHours', headerName: 'Horas' },
    { field: 'windDirection', headerName: 'Dirección del Viento' },
    { field: 'precipitation', headerName: 'Precipitación' },
    { field: 'temperature', headerName: 'Temperatura' },
    { field: 'humidity', headerName: 'Humedad' },
  ];

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography mb={2} component="h3" variant="h6" color="primary">
        Datos Meteorológicos
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index}>{column.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {columns.map((column, idx) => (
                  <TableCell key={idx}>{row[column.field]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
