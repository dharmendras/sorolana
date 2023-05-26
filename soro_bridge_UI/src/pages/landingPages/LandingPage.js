import { Typography, Box, Card } from '@mui/material';
import Container from '@mui/material/Container';
import React from 'react'

function LandingPage() {
    return (
        <>
            <Container sx={{ background: 'black', height: '100vh' }}>
                <Typography variant='h6' sx={{ color: 'white', fontSize: '45px', textAlign: 'center', pt: 3 }}>Trustless Bridge
                </Typography>
                <Typography variant='h6' sx={{ color: 'white', fontSize: '45px', textAlign: 'center' }}>
                    Soroban Assets to Solana</Typography>
                <Box sx={{ display: 'flex', pt: 5 }}>
                    <Box sx={{ paddingLeft: 5 }}>
                        <Card sx={{
                            width: 250,
                            height: 250,
                            border: 1,
                            borderRadius: 40,
                            backgroundColor: 'transparent',
                            borderColor: 'white',
                            textAlign: 'center',
                            pt: 11,
                            // display: 'flex',
                            // justifyContent: 'center',
                            // alignItems: 'center',

                        }}>
                            <Box
                                width={25}
                                height={25}
                                component='img'
                                alt="soroban"
                                src='steller.png'
                            />
                            <Typography sx={{ color: 'white' }}>Steller</Typography>

                        </Card>
                    </Box>
                    <Box >
                        <Card sx={{
                            width: 250,
                            height: 250,
                            border: 1,
                            borderRadius: 40,
                            borderStyle: 'dashed',
                            borderColor: '#EBFF00',
                            backgroundColor: 'transparent',
                            textAlign: 'center',
                            pt: 11
                            // display: 'flex',
                            // justifyContent: 'center',
                            // alignItems: 'center',
                        }}>
                            <Box
                                width={25}
                                height={25}
                                component='img'
                                alt="soroban"
                                src='SoroBan.png'
                            />
                            <Typography sx={{ color: 'white' }}>Soroban</Typography>

                        </Card>
                    </Box>

                    <Box sx={{ paddingLeft: 10, pt: 10 }}>
                        <Box
                            sx={{ position: 'relative' }}
                            component='img'
                            alt='hexagonal'
                            src='hexagonal.png'
                        />
                        <Typography variant='body2' sx={{
                            color: 'white',
                            position: 'absolute',
                            // top: 10,
                            bottom: '40%',
                            left: '56.5%',
                            // transform: 'translateX(-50%)'
                        }}>Sorolana</Typography>
                    </Box>

                    <Box sx={{ paddingLeft: 10 }}>
                        <Card sx={{
                            width: 250,
                            height: 250,
                            border: 1,
                            borderRadius: 40,
                            borderStyle: 'dashed',
                            borderColor: '#CD69E5',
                            backgroundColor: 'transparent',
                            textAlign: 'center',
                            pt: 11
                            // display: 'flex',
                            // justifyContent: 'center',
                            // alignItems: 'center',


                        }}>
                            <Box
                                width={25}
                                height={25}
                                component='img'
                                alt="soroban"
                                src='solana.png'
                            />
                            <Typography sx={{ color: 'white' }}>Solana</Typography>

                        </Card>
                    </Box>
                </Box>



            </Container>
        </>
    )
}

export default LandingPage