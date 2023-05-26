import { Container, Typography, Grid } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'

function Trending() {
    return (
        <>
            <Container sx={{ pt: 5 }}>
                <Typography variant='h5' sx={{ color: 'white', fontSize: '60px' }}>Trending</Typography>
                <Grid container sx={{ pt: 5 }}>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 2 }}>
                            <Box
                                width={30}
                                component='img'
                                alt='usd'
                                src='usd.png'
                            />
                            <Typography variant='body2' sx={{ color: 'white', fontSize: '18px' }}>USD/
                                <span style={{ fontSize: '10px', color: '#A1A1A1' }}>xml</span>
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'white', fontSize: '18px' }}>$ 187.33/
                                <span style={{ fontSize: '10px', color: '#A1A1A1' }}>XML 123.99</span>
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 2 }}>
                            <Box
                                width={30}
                                component='img'
                                alt='usd'
                                src='edgecoin.png'
                            />
                            <Typography variant='body2' sx={{ color: 'white', fontSize: '18px' }}>USD/
                                <span style={{ fontSize: '10px', color: '#A1A1A1' }}>xml</span>
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'white', fontSize: '18px' }}>$ 187.33/
                                <span style={{ fontSize: '10px', color: '#A1A1A1' }}>XML 123.99</span>
                            </Typography>
                        </Box>


                        <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 2 }}>
                            <Box
                                width={30}
                                component='img'
                                alt='usd'
                                src='wirex.png'
                            />
                            <Typography variant='body2' sx={{ color: 'white', fontSize: '18px' }}>USD/
                                <span style={{ fontSize: '10px', color: '#A1A1A1' }}>xml</span>
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'white', fontSize: '18px' }}>$ 187.33/
                                <span style={{ fontSize: '10px', color: '#A1A1A1' }}>XML 123.99</span>
                            </Typography>
                        </Box>


                        <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 2 }}>
                            <Box
                                width={30}
                                component='img'
                                alt='usd'
                                src='radio.png'
                            />
                            <Typography variant='body2' sx={{ color: 'white', fontSize: '18px' }}>USD/
                                <span style={{ fontSize: '10px', color: '#A1A1A1' }}>xml</span>
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'white', fontSize: '18px' }}>$ 187.33/
                                <span style={{ fontSize: '10px', color: '#A1A1A1' }}>XML 123.99</span>
                            </Typography>
                        </Box>

                    </Grid>

                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 2 }}>
                            <Typography variant='body2' sx={{ color: 'white', fontSize: '18px' }}>
                                <span style={{ fontSize: '10px', color: '#4EBE4E' }}>+</span>
                                0.76
                            </Typography>
                            <Box
                                width={40}
                                component='img'
                                alt='usd'
                                src='waveline.png'
                            />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 2.5 }}>
                            <Typography variant='body2' sx={{ color: 'white', fontSize: '18px' }}>
                                <span style={{ fontSize: '10px', color: '#4EBE4E' }}>+</span>
                                0.76
                            </Typography>
                            <Box
                                width={40}
                                component='img'
                                alt='usd'
                                src='waveline.png'
                            />
                        </Box>


                        <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 2.5 }}>
                            <Typography variant='body2' sx={{ color: 'white', fontSize: '18px' }}>
                                <span style={{ fontSize: '10px', color: '#4EBE4E' }}>+</span>
                                0.76
                            </Typography>
                            <Box
                                width={40}
                                component='img'
                                alt='usd'
                                src='waveline.png'
                            />
                        </Box>


                        <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 2.5 }}>
                            <Typography variant='body2' sx={{ color: 'white', fontSize: '18px' }}>
                                <span style={{ fontSize: '10px', color: '#4EBE4E' }}>+</span>
                                0.76
                            </Typography>
                            <Box
                                width={40}
                                component='img'
                                alt='usd'
                                src='waveline.png'
                            />
                        </Box>

                    </Grid>


                </Grid>
            </Container>
        </>
    )
}

export default Trending