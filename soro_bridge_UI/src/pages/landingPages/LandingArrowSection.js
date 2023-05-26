import { Card, Container, Typography, Grid, Box } from '@mui/material'
import React from 'react'
import SouthEastIcon from '@mui/icons-material/SouthEast';


function LandingArrowSection() {
    return (
        <>
            <Container sx={{ paddingBottom: 5 }}>
                <Card sx={{
                    backgroundColor: '#050B14',
                    border: 1,
                    borderColor: '#1F8BF4',
                    borderRadius: 4,
                    paddingBottom: 3
                }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography
                                variant='body2'
                                sx={{
                                    color: 'white',
                                    fontSize: '20px',
                                    paddingX: 5,
                                    pt: 5
                                }}
                            > Empower Soroban tokens with Solana’s proven NFT and DeFi ecosystem</Typography>

                            <Box sx={{ pt: 10, textAlign: 'center' }}>
                                <SouthEastIcon sx={{
                                    color: '#2695FF',
                                    fontSize: 100,
                                }} />
                            </Box>


                        </Grid>


                        <Grid item xs={6} >

                            <Grid container sx={{ paddingTop: 5 }}>
                                <Grid item xs={6} sx={{ borderRight: 1, borderColor: '#2695FF' }}>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            color: 'white',
                                            fontSize: '25px',
                                            textAlign: 'center'
                                        }}
                                    > 132,875</Typography>
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            color: 'white',
                                            fontSize: '15px',
                                            textAlign: 'center'

                                        }}
                                    > Transaction</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            color: 'white',
                                            fontSize: '25px',
                                            textAlign: 'center'

                                        }}
                                    >  $ 132,875</Typography>
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            color: 'white',
                                            fontSize: '15px',
                                            textAlign: 'center'

                                        }}
                                    > Value</Typography>
                                </Grid>
                            </Grid>

                            <Grid container sx={{ paddingTop: 8 }}>
                                <Grid item xs={6}>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            color: 'white',
                                            fontSize: '25px',
                                            textAlign: 'center'

                                        }}
                                    >$ 132,875</Typography>
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            color: 'white',
                                            fontSize: '15px',
                                            textAlign: 'center'

                                        }}
                                    >  Lowest Trade Fee
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            color: 'white',
                                            fontSize: '25px',
                                            textAlign: 'center'

                                        }}
                                    >  100%</Typography>
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            color: 'white',
                                            fontSize: '15px',
                                            textAlign: 'center'

                                        }}
                                    > Bridge Fee Cashback</Typography>
                                </Grid>
                            </Grid>

                        </Grid>

                    </Grid>
                </Card>
            </Container>
        </>
    )
}

export default LandingArrowSection