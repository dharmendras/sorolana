import React from 'react'
import { Container, Card, Grid, MenuItem, TextField, Typography, Box, Button } from '@mui/material'
import { shortAddress } from '@/component/utils/Utils';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BridgeAssetNavbar from '@/component/BridgeAssetNavbar';




const style = {
    // position: 'absolute',
    // top: '45%',
    // left: '50%',
    // transform: 'translate(-50%, -50%)',

    width: 600,
    bgcolor: 'black',
    border: 1,
    borderColor: 'blue',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};


function Claim() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (

        <>
            <Box sx={{ background: 'black', height: '100vh' }}>

                <BridgeAssetNavbar />

                <Container sx={{ pt: 15, display: 'flex', justifyContent: 'center' }}>

                    <Card
                        sx={{

                            border: 1,
                            borderColor: '#1F8BF4',
                            borderRadius: 3,
                            width: 600,
                            bgcolor: 'transparent',
                            px: 4,


                        }}>
                        <Typography variannt='h6'
                            sx={{ color: 'white', fontSize: '25px', textAlign: 'center', pt: 3 }}>Claim Assets</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', pt: 5 }}>
                            <Typography variannt='body2'
                                sx={{ color: 'white', fontSize: '15px', textAlign: 'start' }}>
                                Message</Typography>
                            <HelpOutlineIcon sx={{ width: 20, paddingLeft: '3px' }} />
                        </Box>

                        <Box sx={{ pt: 1 }}>
                            <Card
                                sx={{
                                    border: 1,
                                    borderColor: 'white',
                                    borderRadius: 2,
                                    backgroundColor: 'transparent',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    py: 1,
                                    px: '10px'
                                }}>
                                <Typography variant='body2' sx={{ color: 'white' }}>{shortAddress('098765432')}</Typography>
                                < ContentCopyIcon sx={{ color: 'white' }} />
                            </Card>
                        </Box>

                        <Grid container sx={{ pt: 5 }}>
                            <Grid item xs={6}>
                                <Typography variannt='body2'
                                    sx={{
                                        color: 'white',
                                        fontSize: '12px',
                                        textAlign: 'start',
                                        pt: 1
                                    }}>
                                    To :
                                </Typography>

                            </Grid>
                            <Grid item xs={6}>
                                <Typography variannt='body2'
                                    sx={{
                                        color: 'white',
                                        fontSize: '12px',
                                        textAlign: 'end',
                                        pt: 1
                                    }}>
                                    {shortAddress('098765432')}
                                </Typography>
                            </Grid>

                        </Grid>

                        <Grid container sx={{ pt: 3 }}>
                            <Grid item xs={6}>
                                <Typography variannt='body2'
                                    sx={{
                                        color: 'white',
                                        fontSize: '12px',
                                        textAlign: 'start',
                                    }}>
                                    From
                                </Typography>

                            </Grid>
                            <Grid item xs={6}>
                                <Typography variannt='body2'
                                    sx={{
                                        color: 'white',
                                        fontSize: '12px',
                                        textAlign: 'end',
                                    }}>
                                    {shortAddress('098765432')}
                                </Typography>
                            </Grid>

                        </Grid>

                        <Grid container sx={{ pt: 3 }}>
                            <Grid item xs={6}>
                                <Typography variannt='body2'
                                    sx={{
                                        color: 'white',
                                        fontSize: '12px',
                                        textAlign: 'start',
                                        pt: 1
                                    }}>
                                    Transection Fee :
                                </Typography>

                            </Grid>
                            <Grid item xs={6}>
                                <Typography variannt='body2'
                                    sx={{
                                        color: 'white',
                                        fontSize: '12px',
                                        textAlign: 'end',
                                        pt: 1
                                    }}>
                                    123456789
                                </Typography>
                            </Grid>

                        </Grid>

                        <Grid container sx={{ pt: 3 }}>
                            <Grid item xs={6} >
                                <Typography variannt='body2'
                                    sx={{
                                        color: 'white',
                                        fontSize: '12px',
                                        textAlign: 'start',
                                    }}>
                                    Gas Price :
                                </Typography>

                            </Grid>
                            <Grid item xs={6}>
                                <Typography variannt='body2'
                                    sx={{
                                        color: 'white',
                                        fontSize: '12px',
                                        textAlign: 'end',
                                    }}>
                                    0.345678
                                </Typography>
                            </Grid>

                        </Grid>

                        <Box sx={{ textAlign: 'center', py: 5 }}>
                            <Button variant='outlined' sx={{
                                width: 200,
                                height: 30,
                                textAlign: 'center',
                                backgroundColor: 'transparent',
                                border: 1,
                                borderColor: 'white',
                                color: 'white'
                            }}
                                onClick={handleClose}
                            >Claim</Button>
                        </Box>

                    </Card>
                </Container>
            </Box>
        </>
    )
}

export default Claim