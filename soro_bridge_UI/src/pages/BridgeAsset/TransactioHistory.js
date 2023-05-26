import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper, Container } from '@mui/material';

function createData(name, calories, fat, carbs, protein, status) {
    return { name, calories, fat, carbs, protein, status };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 'success'),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 'success'),
    createData('Eclair', 262, 16.0, 24, 6.0, 'success'),
    createData('Cupcake', 305, 3.7, 67, 4.3, 'success'),
    createData('Gingerbread', 356, 16.0, 49, 3.9, 'success'),
];

export default function TransactionHistory() {
    return (

        <Container sx={{ pt: 10 }}>
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow >
                            <TableCell align="center" sx={{ color: 'white' }}>To</TableCell>
                            <TableCell align="center" sx={{ color: 'white' }}>From</TableCell>
                            <TableCell align="center" sx={{ color: 'white' }}>Value</TableCell>
                            <TableCell align="center" sx={{ color: 'white' }}>Transaction Fee</TableCell>
                            <TableCell align="center" sx={{ color: 'white' }}>Gas Fee</TableCell>
                            <TableCell align="center" sx={{ color: 'white' }}>Status</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" align="center" sx={{ color: 'white' }}>
                                    {row.name}
                                </TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>{row.calories}</TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>{row.fat}</TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>{row.carbs}</TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>{row.protein}</TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>{row.status}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>

    );
}