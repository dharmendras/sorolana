import { Container, Grid, Typography, Box, Card } from '@mui/material'
import React from 'react'

function CrossChain() {

    return (
        <>
            <Container sx={{ pt: 5 }}>
                <Grid container>
                    <Grid xs={6}>
                        <Typography
                            variant='h6'
                            sx={{ color: 'white', fontSize: '55px' }}
                        >
                            Going cross-chain just
                            got way better
                        </Typography>
                        <Typography
                            variant='body2'
                            sx={{ color: 'white', fontSize: '16px', pt: 3 }}
                        >
                            Enabling users the ability to bridge assets between Both chain
                        </Typography>
                    </Grid>
                    <Grid xs={6} sx={{ textAlign: 'center', pt: 5 }}>
                        <Box
                            component='img'
                            alt="soroban"
                            src='chaincross.png'
                        />
                    </Grid>
                </Grid>

                <Grid container sx={{ py: 5 }}>
                    <Grid xs={4} sx={{ paddingRight: 2 }}>
                        <Card sx={{ border: 1, borderColor: '#1F8BF4', borderRadius: 4, backgroundColor: '#050B14' }}>
                            <Typography
                                variant='h6'
                                sx={{ fontSize: '22px', color: 'white', textAlign: 'center', pt: 3 }}
                            >
                                security
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{ fontSize: '15px', color: 'white', textAlign: 'center', p: 5 }}
                            >
                                Security of cross-chain communication using decentralized consensus
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid xs={4} sx={{ paddingX: 2 }}>
                        <Card sx={{ border: 1, borderColor: '#1F8BF4', borderRadius: 4, backgroundColor: '#050B14' }}>
                            <Typography
                                variant='h6'
                                sx={{ fontSize: '22px', color: 'white', textAlign: 'center', pt: 3 }}
                            >
                                Scalability
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{ fontSize: '15px', color: 'white', textAlign: 'center', p: 3.8 }}
                            >
                                Innovative solutions that allow for trustless asset transfers without relying on liquidity pools.                            </Typography>
                        </Card>
                    </Grid>
                    <Grid xs={4} sx={{ paddingLeft: 2 }}>
                        <Card sx={{ border: 1, borderColor: '#1F8BF4', borderRadius: 4, backgroundColor: '#050B14' }}>
                            <Typography
                                variant='h6'
                                sx={{ fontSize: '22px', color: 'white', textAlign: 'center', pt: 3 }}
                            >
                                Freedom
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{ fontSize: '15px', color: 'white', textAlign: 'center', pt: 5, paddingBottom: 8 }}
                            >
                                Anybody can register  token by paying the gas fee.                            </Typography>
                        </Card>
                    </Grid>

                </Grid>


                <Grid container sx={{ py: 2 }}>
                    <Grid xs={4} sx={{ paddingRight: 2 }}>
                        <Card sx={{ border: 1, borderColor: '#1F8BF4', borderRadius: 4, backgroundColor: '#050B14' }}>
                            <Typography
                                variant='h6'
                                sx={{ fontSize: '22px', color: 'white', textAlign: 'center', pt: 3 }}
                            >
                                Liquidity
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{ fontSize: '15px', color: 'white', textAlign: 'center', p: 5.5 }}
                            >
                                Extend Liquidity by Cross-chain liquidity extension                            </Typography>
                        </Card>
                    </Grid>
                    <Grid xs={4} sx={{ paddingX: 2 }}>
                        <Card sx={{ border: 1, borderColor: '#1F8BF4', borderRadius: 4, backgroundColor: '#050B14' }}>
                            <Typography
                                variant='h6'
                                sx={{ fontSize: '22px', color: 'white', textAlign: 'center', pt: 3 }}
                            >
                                Ecosystem
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{ fontSize: '15px', color: 'white', textAlign: 'center', pt: 5, paddingBottom: 6 }}
                            >
                                Leverage global messaging protocol (GMP) for cross-chain communication
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid xs={4} sx={{ paddingLeft: 2 }}>
                        <Card sx={{ border: 1, borderColor: '#1F8BF4', borderRadius: 4, backgroundColor: '#050B14' }}>
                            <Typography
                                variant='h6'
                                sx={{ fontSize: '22px', color: 'white', textAlign: 'center', pt: 3 }}
                            >
                                Real time
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{ fontSize: '15px', color: 'white', textAlign: 'center', pt: 5, paddingBottom: 6 }}
                            >
                                Real-Time and Batch Relay Enhancing Efficiency in Data Transmission
                            </Typography>
                        </Card>
                    </Grid>

                </Grid>

            </Container>
        </>
    )
}

export default CrossChain