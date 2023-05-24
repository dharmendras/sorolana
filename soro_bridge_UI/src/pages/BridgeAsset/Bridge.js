import Navbar from '@/component/Navbar';
import { Container, Card, Grid, MenuItem, TextField, Typography, Box, Button } from '@mui/material'
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import React from 'react'
import Checkbox from '@mui/material/Checkbox';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';



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

function Bridge() {
    return (
        <>
            <Container sx={{ background: 'black', mt: 10 }}>

                <Card sx={{
                    border: 1,
                    borderColor: 'blue',
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    color: 'white'
                }}>

                    <Typography variannt='h6' sx={{ color: 'white', fontSize: '30px', textAlign: 'center' }}> Bridge Asset</Typography>

                    {/* 1st row */}

                    <Grid container sx={{ paddingTop: 3 }}>

                        <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box>
                                <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}> From (Source)</Typography>

                                <TextField


                                    sx={{
                                        border: 1,
                                        borderColor: 'white',
                                        borderRadius: 3,
                                        width: 400,
                                        height: 40,
                                        '&.MuiFormControl-root-MuiTextField-root': {
                                            color: 'white'
                                        },
                                        '&.MuiInputBase-root-MuiOutlinedInput-root.Mui-disabled': {
                                            '&.focused': {
                                                border: 'none'
                                            },

                                        }


                                    }}
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
                        <Grid item xs={5}>
                            <Box>
                                <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>To (Destination)</Typography>

                                <TextField

                                    sx={{
                                        border: 1,
                                        borderColor: 'white',
                                        borderRadius: 3,
                                        width: 400,
                                        height: 40,
                                        '&.MuiFormControl-root-MuiTextField-root': {
                                            color: 'white'
                                        },
                                        '&.MuiInputBase-root-MuiOutlinedInput-root.Mui-disabled': {
                                            '&.focused': {
                                                border: 'none'
                                            },

                                        }


                                    }}
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
                        <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'center' }} >
                            <Box>
                                <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>Assets (You had like to bridge)</Typography>

                                <TextField

                                    sx={{
                                        border: 1,
                                        borderColor: 'white',
                                        borderRadius: 3,
                                        width: 400,
                                        height: 40,
                                        '&.MuiFormControl-root-MuiTextField-root': {
                                            color: 'white'
                                        },
                                        '&.MuiInputBase-root-MuiOutlinedInput-root.Mui-disabled': {
                                            '&.focused': {
                                                border: 'none'
                                            },

                                        }


                                    }}
                                >

                                </TextField>
                            </Box>
                        </Grid>
                        <Grid xs={2}>

                        </Grid>
                        <Grid item xs={5}>
                            <Box>
                                <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>Amount</Typography>

                                <TextField

                                    sx={{
                                        border: 1,
                                        borderColor: 'white',
                                        borderRadius: 3,
                                        width: 400,
                                        height: 40,
                                        '&.MuiFormControl-root-MuiTextField-root': {
                                            color: 'white'
                                        },
                                        '&.MuiInputBase-root-MuiOutlinedInput-root.Mui-disabled': {
                                            '&.focused': {
                                                border: 'none'
                                            },

                                        }


                                    }}
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
                        <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box>
                                <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>Relayer </Typography>

                                <TextField

                                    sx={{
                                        border: 1,
                                        borderColor: 'white',
                                        borderRadius: 3,
                                        width: 400,
                                        height: 40,
                                        '&.MuiFormControl-root-MuiTextField-root': {
                                            color: 'white'
                                        },
                                        '&.MuiInputBase-root-MuiOutlinedInput-root.Mui-disabled': {
                                            '&.focused': {
                                                border: 'none'
                                            },

                                        }


                                    }}
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
                        <Grid item xs={5}>
                            <Box>
                                <Typography variant='body2' sx={{ color: 'white', fontSize: '15px' }}>Destination</Typography>

                                <TextField

                                    sx={{
                                        border: 1,
                                        borderColor: 'white',
                                        borderRadius: 3,
                                        width: 400,
                                        height: 40,
                                        "& fieldset":
                                            { border: 'none' },


                                        '&.MuiFormControl-root-MuiTextField-root': {
                                            color: 'white'

                                        },
                                        '&.MuiInputBase-root-MuiOutlinedInput-root.Mui-disabled': {
                                            '&.focused': {
                                                border: 'none'
                                            },

                                        }


                                    }}
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
                        }}>Bridge Token</Button>
                    </Box>




                </Card>
            </Container>
        </>
    )
}

export default Bridge