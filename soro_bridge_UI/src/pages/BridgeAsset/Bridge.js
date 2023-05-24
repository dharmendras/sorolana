import Navbar from '@/component/Navbar';
import { Container, Card, Grid, MenuItem, TextField, Typography, Box, Button } from '@mui/material'
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import React from 'react'
import Checkbox from '@mui/material/Checkbox';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Modal from '@mui/material/Modal';
import BridgeAssetNavbar from '@/component/BridgeAssetNavbar';



const currencies = [
    {
        value: 'USD',
        label: '$',
    },
    {
        value: 'EUR',
        label: '€',
    },
    {
        value: 'BTC',
        label: '฿',
    },
    {
        value: 'JPY',
        label: '¥',
    },
];

const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'black',
    border: 1,
    borderColor: 'blue',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};

function Bridge() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);



    return (
        <>
            <Box sx={{ background: 'black', height: '100vh' }}>
                <BridgeAssetNavbar />
                <Container sx={{ pt: 13 }}>

                    <Card sx={{
                        border: 1,
                        borderColor: 'blue',
                        backgroundColor: 'transparent',
                        borderRadius: 5,
                        paddingX: 10
                    }}>

                        <Typography variannt='h6' sx={{ color: 'white', fontSize: '30px', textAlign: 'center', pt: 5 }}> Bridge Asset</Typography>

                        {/* 1st row */}

                        <Grid container sx={{ paddingTop: 3 }}>

                            <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'end' }}>
                                <Box>
                                    <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}> From (Source)</Typography>

                                    <TextField
                                        sx={{
                                            border: 1,
                                            borderColor: 'white',
                                            borderRadius: 3,
                                            width: 400,
                                            height: 40,
                                            color: 'white',

                                            '& .MuiInput-underline:after': {
                                                border: 'none',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none',
                                                },
                                                '&:hover fieldset': {
                                                    border: 'none',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    border: 'none',
                                                },
                                            }

                                        }
                                        }
                                    >
                                        {/* {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                    </MenuItem>
                      ))} */}
                                    </TextField>
                                </Box>


                            </Grid>
                            <Grid xs={2} sx={{ display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
                                <SwapHorizontalCircleIcon sx={{ color: 'white', fontSize: 50 }} />
                            </Grid>
                            <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'start' }}>
                                <Box>
                                    <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>To (Destination)</Typography>

                                    <TextField
                                        sx={{
                                            border: 1,
                                            borderColor: 'white',
                                            borderRadius: 3,
                                            width: 400,
                                            height: 40,
                                            color: 'white',

                                            '& .MuiInput-underline:after': {
                                                border: 'none',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none',
                                                },
                                                '&:hover fieldset': {
                                                    border: 'none',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    border: 'none',
                                                },
                                            }

                                        }
                                        }
                                    >
                                        {/* {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                    </MenuItem>
                      ))} */}
                                    </TextField>
                                </Box>
                            </Grid>

                        </Grid>

                        {/* 2nd row */}

                        <Grid container sx={{ paddingTop: 3 }}>
                            <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'end' }} >
                                <Box>
                                    <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>Assets (You had like to bridge)</Typography>

                                    <TextField

                                        sx={{
                                            border: 1,
                                            borderColor: 'white',
                                            borderRadius: 3,
                                            width: 400,
                                            height: 40,
                                            color: 'white',

                                            '& .MuiInput-underline:after': {
                                                border: 'none',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none',
                                                },
                                                '&:hover fieldset': {
                                                    border: 'none',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    border: 'none',
                                                },
                                            }

                                        }
                                        }
                                    >

                                    </TextField>
                                </Box>
                            </Grid>
                            <Grid xs={2}>

                            </Grid>
                            <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'start' }}>
                                <Box>
                                    <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>Amount</Typography>

                                    <TextField

                                        sx={{
                                            border: 1,
                                            borderColor: 'white',
                                            borderRadius: 3,
                                            width: 400,
                                            height: 40,
                                            color: 'white',

                                            '& .MuiInput-underline:after': {
                                                border: 'none',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none',
                                                },
                                                '&:hover fieldset': {
                                                    border: 'none',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    border: 'none',
                                                },
                                            }

                                        }
                                        }
                                    >
                                        {/* {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                    </MenuItem>
                      ))} */}
                                    </TextField>
                                </Box>
                            </Grid>

                        </Grid>


                        {/* 3rd row */}

                        <Grid container sx={{ paddingTop: 3 }}>
                            <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'end' }}>
                                <Box>
                                    <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>Relayer </Typography>

                                    <TextField
                                        sx={{
                                            border: 1,
                                            borderColor: 'white',
                                            borderRadius: 3,
                                            width: 400,
                                            height: 40,
                                            color: 'white',

                                            '& .MuiInput-underline:after': {
                                                border: 'none',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none',
                                                },
                                                '&:hover fieldset': {
                                                    border: 'none',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    border: 'none',
                                                },
                                            }

                                        }
                                        }
                                    >
                                        {/* {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                    </MenuItem>
                      ))} */}
                                    </TextField>
                                </Box>
                            </Grid>
                            <Grid xs={2}>

                            </Grid>
                            <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'start' }}>
                                <Box>
                                    <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>Destination</Typography>

                                    <TextField
                                        sx={{
                                            border: 1,
                                            borderColor: 'white',
                                            borderRadius: 3,
                                            width: 400,
                                            height: 40,
                                            color: 'white',

                                            '& .MuiInput-underline:after': {
                                                border: 'none',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: 'none',
                                                },
                                                '&:hover fieldset': {
                                                    border: 'none',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    border: 'none',
                                                },
                                            }

                                        }
                                        }
                                    >
                                        {/* {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                    </MenuItem>
                      ))} */}
                                    </TextField>
                                </Box>
                            </Grid>

                        </Grid>


                        {/* 4th row */}

                        <Grid container sx={{ paddingTop: 3 }}>
                            <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                    <WarningAmberIcon sx={{ color: 'red', fontSize: 30 }} />
                                    <Typography sx={{ color: 'white' }}>Bridge charges 0.07% upon every transection </Typography>

                                </Box>

                            </Grid>
                            <Grid xs={2}>

                            </Grid>
                            <Grid item xs={5}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Checkbox
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 }, textAlign: 'end' }} />
                                    <Typography sx={{ color: 'white' }}>Accept</Typography>
                                </Box>

                            </Grid>

                        </Grid>


                        <Box sx={{ textAlign: 'center', paddingY: 5 }}>
                            <Button variant='contained' sx={{
                                width: 350,
                                textAlign: 'center',
                                backgroundColor: 'transparent',
                                border: 1,
                                borderColor: 'white'
                            }}
                                onClick={handleOpen}
                            >Bridge Token</Button>


                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <Typography variannt='h6'
                                        sx={{ color: 'white', fontSize: '25px', textAlign: 'center', pt: 1 }}>Transection Details</Typography>

                                    <Grid container sx={{ pt: 2 }}>
                                        <Grid item xs={6}>
                                            <Typography variannt='body2'
                                                sx={{
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    textAlign: 'start',
                                                    pt: 1
                                                }}>
                                                Transection Hash
                                            </Typography>

                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variannt='body2'
                                                sx={{
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    textAlign: 'center',
                                                    pt: 1
                                                }}>
                                                123456789
                                            </Typography>
                                        </Grid>

                                    </Grid>

                                    <Grid container sx={{ pt: 2 }}>
                                        <Grid item xs={6}>
                                            <Typography variannt='body2'
                                                sx={{
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    textAlign: 'start',
                                                    pt: 1
                                                }}>
                                                status
                                            </Typography>

                                        </Grid>
                                        <Grid item xs={6} sx={{ textAlign: 'center' }}>
                                            <Button variant="outlined"
                                                sx={{
                                                    backgroundColor: '#4da14d',
                                                    color: 'black',
                                                    width: 50,
                                                    height: 20,
                                                    fontSize: '10px',
                                                    border: 2,
                                                    borderColor: 'green'
                                                }}>success</Button>
                                        </Grid>

                                    </Grid>

                                    <Grid container sx={{ pt: 2 }}>
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
                                                    textAlign: 'center',
                                                    pt: 1
                                                }}>
                                                023456789
                                            </Typography>
                                        </Grid>

                                    </Grid>

                                    <Grid container sx={{ pt: 2 }}>
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
                                                    textAlign: 'center',
                                                }}>
                                                123456789098
                                            </Typography>
                                        </Grid>

                                    </Grid>

                                    <Grid container sx={{ pt: 2 }}>
                                        <Grid item xs={6}>
                                            <Typography variannt='body2'
                                                sx={{
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    textAlign: 'start',
                                                }}>
                                                Value :
                                            </Typography>

                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variannt='body2'
                                                sx={{
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    textAlign: 'center',
                                                }}>
                                                123456789
                                            </Typography>
                                        </Grid>

                                    </Grid>

                                    <Grid container sx={{ pt: 2 }}>
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
                                                    textAlign: 'center',
                                                    pt: 1
                                                }}>
                                                123456789
                                            </Typography>
                                        </Grid>

                                    </Grid>

                                    <Grid container sx={{ pt: 2 }}>
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
                                                    textAlign: 'center',
                                                }}>
                                                0.345678
                                            </Typography>
                                        </Grid>

                                    </Grid>

                                    <Box sx={{ textAlign: 'center', pt: 2 }}>
                                        <Button variant='contained' sx={{
                                            width: 200,
                                            height: 30,
                                            textAlign: 'center',
                                            backgroundColor: 'transparent',
                                            border: 1,
                                            borderColor: 'white'
                                        }}
                                            onClick={handleClose}
                                        >Done</Button>
                                    </Box>

                                </Box>
                            </Modal>
                        </Box>




                    </Card>
                </Container>
            </Box>

        </>
    )
}

export default Bridge