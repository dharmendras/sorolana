import React from 'react'
import { Container, Typography, Box, Card } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function HowWorks() {
    return (
        <>
            <Container sx={{ pt: 5, paddingBottom: 5 }}>
                <Typography variant='h6' sx={{ color: 'white', fontSize: '60px' }}>How it works</Typography>

                <Box sx={{
                    mt: 3,
                    px: 5,
                    py: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: 1,
                    borderTop: 1,
                    borderColor: 'white'
                }}>

                    <Typography variant='body2'
                        sx={{ color: 'white', fontSize: '18px' }}>
                        How do blockchain bridges work?</Typography>
                    <AddCircleOutlineIcon sx={{ color: 'white' }} />

                </Box>

                <Box sx={{
                    mt: 3,
                    px: 5,
                    py: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: 1,
                    borderTop: 1,
                    borderColor: 'white'
                }}>

                    <Typography variant='body2'
                        sx={{ color: 'white', fontSize: '18px' }}>
                        What are the benefits of blockchain Bridges?</Typography>
                    <AddCircleOutlineIcon sx={{ color: 'white' }} />

                </Box>


                <Box sx={{
                    mt: 3,
                    px: 5,
                    py: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: 1,
                    borderTop: 1,
                    borderColor: 'white'
                }}>

                    <Typography variant='body2'
                        sx={{ color: 'white', fontSize: '18px' }}>
                        How to transfer the Asset in soroban Bridge ?</Typography>
                    <AddCircleOutlineIcon sx={{ color: 'white' }} />

                </Box>
            </Container>
        </>
    )
}

export default HowWorks