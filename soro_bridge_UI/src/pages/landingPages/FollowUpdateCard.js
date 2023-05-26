import { Container, Card, Grid, Typography, Box, Button } from '@mui/material'
import React from 'react'

function FollowUpdateCard() {
    return (
        <>
            <Container sx={{ pt: 5, paddingBottom: 5 }}>
                <Card sx={{ border: 1, borderColor: '#1F8BF4', backgroundColor: '#050B14', borderRadius: 5, height: 280 }}>
                    <Grid container>
                        <Grid item xs={5}>
                            <Typography variant='h6' sx={{ color: 'white', fontSize: '60px', textAlign: 'center', pt: 3 }}>Follow
                                Our Update</Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Typography variant='body2'
                                sx={{ color: 'white', fontSize: '12px', px: 10, pt: 8 }}>
                                Join our community and be first to Know about our new
                            </Typography>
                            <Typography variant='body2'
                                sx={{ color: 'white', fontSize: '12px', px: 10 }}>

                                fractures, new farming pools and latest Update.
                            </Typography>
                            <Box sx={{ pt: 5, display: 'flex', justifyContent: 'start', paddingLeft: 10, }}>
                                <Box>
                                    <Button variant='outlined' sx={{ borderColor: 'white', color: 'white' }} >Join Telegram</Button>
                                </Box>

                                <Box sx={{ paddingLeft: 3 }}>
                                    <Button variant='outlined' sx={{ borderColor: 'white', color: 'white' }} >Join Twitter</Button>
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>
                </Card>

            </Container>
        </>
    )
}

export default FollowUpdateCard