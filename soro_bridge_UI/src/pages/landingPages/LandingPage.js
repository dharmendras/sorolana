import { Typography, Box, Card } from '@mui/material';
import Container from '@mui/material/Container';
import React from 'react'

function LandingPage() {
    return (
        <>
            <Container sx={{ background: 'black', height: '100vh' }}>
                <Typography variant='h6' sx={{ color: 'white', fontSize: '45px', textAlign: 'center' }}>Trustless Bridge
                </Typography>
                <Typography variant='h6' sx={{ color: 'white', fontSize: '45px', textAlign: 'center' }}>
                    Soroban Assets to Solana</Typography>
                <Box sx={{ display: 'flex' }}>
                    <Box>
                        <Card sx={{
                            width: 300,
                            height: 300,
                            border: 1,
                            borderRadius: 40,
                            backgroundColor: 'transparent',
                            borderColor: 'white',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}>
                            <Box
                                width={20}
                                height={20}
                                component='img'
                                alt="soroban"
                                src='steller.png'
                            />
                            {/* <Typography sx={{ color: 'white' }}>Steller</Typography> */}

                        </Card>
                    </Box>
                    <Box >
                        <Card sx={{
                            width: 300,
                            height: 300,
                            border: 1,
                            borderRadius: 40,
                            borderStyle: 'dashed',
                            borderColor: '#EBFF00',
                            backgroundColor: 'transparent',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Box
                                width={20}
                                height={20}
                                component='img'
                                alt="soroban"
                                src='steller.png'
                            />
                            {/* <Typography sx={{ color: 'white' }}>Steller</Typography> */}

                        </Card>
                    </Box>
                </Box>



            </Container>
        </>
    )
}

export default LandingPage