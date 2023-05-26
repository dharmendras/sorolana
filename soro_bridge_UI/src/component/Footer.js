import React from 'react'
import { Container, Grid, Box, Typography } from '@mui/material'
import { Icon } from '@iconify/react';
function Footer() {
    return (
        <>
            <Container sx={{ pt: 5, paddingBottom: 2 }}>
                <Grid container>
                    <Grid item xs={7}>
                        <Box
                            component='img'
                            alt='logo'
                            src='logo.png'
                        />
                        <Box sx={{ display: 'flex', pt: 3 }}>
                            <Typography variant='body2' sx={{ color: '#B3B3B3', paddingLeft: 3 }}>Disclaimer</Typography>
                            <Typography variant='body2' sx={{ color: '#B3B3B3', paddingLeft: 3 }}>Privacy And GDPR Policy</Typography>
                            <Typography variant='body2' sx={{ color: '#B3B3B3', paddingLeft: 3 }}>Terms And Conditions</Typography>

                        </Box>
                    </Grid>
                    <Grid item xs={5}>
                        <Box sx={{ display: 'flex', justifyContent: 'end', pt: 4, color: '#6E6E6E' }}>
                            <Icon icon="ic:baseline-discord" width={35} />
                            <Icon icon="mdi:twitter" width={35} />
                        </Box>

                        <Typography variant='body2' sx={{ color: '#FFFFFF', textAlign: 'end' }}>Have any question?</Typography>
                        <Typography variant='body2' sx={{ color: '#B3B3B3', textAlign: 'end' }}>Copyright © 2023 All rights reserved. Sorolana</Typography>

                    </Grid>

                </Grid>
            </Container>
        </>
    )
}

export default Footer