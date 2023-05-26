import React from 'react'
import { Card, Container, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
function SoroBlockchains() {
    return (
        <>
            <Container sx={{ paddingTop: 5, paddingBottom: 5 }}>
                <Grid container>
                    <Grid item xs={6}>
                        <Box
                            sx={{ pt: 8 }}
                            component='img'
                            alt='sorolana'
                            src='../soroworld.png'
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Box>
                            <Typography variant='h6' sx={{
                                color: 'white',
                                fontSize: '60px'
                            }}> Sorolana brings best of the both worlds </Typography>
                            <Typography variant='h6' sx={{
                                color: 'white',
                                fontSize: '15px'
                            }}>Sorolana offers a seamless bridge that enables the exchange of Soroban assets to Solana and facilitates a true cross-chain DeFi ecosystem. Our bridge protocol ensures a safe and efficient transfer of assets, while our platform's integration with Solana's DeFi ecosystem enables users to participate in various DeFi applications and earn yield on their Soroban assets. With our platform, users can easily access the benefits of both Soroban and Solana, and enjoy a seamless cross-chain experience.
                            </Typography>
                        </Box>
                    </Grid>

                </Grid>

                <Grid container sx={{ pt: 10 }}>
                    <Grid item xs={4} sx={{ borderTop: 1, borderColor: 'white' }}>
                        <Card
                            sx={{ height: 200, borderRight: 1, borderColor: 'white', borderRadius: 10, backgroundColor: 'transparent' }}>
                            <Container>
                                <Typography variant='h6' sx={{ color: 'white', paddingTop: 2, paddingLeft: 3.5 }}> Steller</Typography>
                                <List sx={{
                                    pt: 2,
                                    color: 'white',
                                    fontSize: '12px',
                                    fontFamily: 'sans-serif',
                                    listStyleType: 'disc',
                                    pl: 2,
                                    '& .MuiListItem-root': {
                                        display: 'list-item',
                                    },
                                }}>
                                    <ListItem>Trusted Network for moving money</ListItem>
                                    <ListItem>Proven Anchor ecosystem for On and Off Ramp</ListItem>
                                    <ListItem>Transaction Speed</ListItem>

                                </List>
                            </Container>

                        </Card>
                    </Grid>
                    <Grid item xs={4} sx={{ borderTop: 1, borderColor: 'white' }}>
                        <Card
                            sx={{ height: 200, borderLeft: 1, borderRight: 1, borderColor: 'white', borderRadius: 10, backgroundColor: 'transparent' }}>
                            <Container>
                                <Typography variant='h6' sx={{ color: 'white', paddingTop: 2, paddingLeft: 3.5 }}> Soroban</Typography>
                                <List sx={{
                                    pt: 2,
                                    color: 'white',
                                    fontSize: '12px',
                                    fontFamily: 'sans-serif',

                                    listStyleType: 'disc',
                                    pl: 2,
                                    '& .MuiListItem-root': {
                                        display: 'list-item',
                                    },
                                }}>
                                    <ListItem>Scalable smart contract platform</ListItem>
                                    <ListItem>Seamless Stellar interoperability</ListItem>
                                    {/* <ListItem>Transaction Speed</ListItem> */}

                                </List>
                            </Container>

                        </Card>
                    </Grid>
                    <Grid item xs={4} sx={{ borderTop: 1, borderColor: 'white' }}>
                        <Card
                            sx={{ height: 200, borderLeft: 1, borderColor: 'white', borderRadius: 10, backgroundColor: 'transparent' }}>
                            <Container>
                                <Typography variant='h6' sx={{ color: 'white', paddingTop: 2, paddingLeft: 3.5 }}> Solana</Typography>
                                <List sx={{
                                    pt: 2,
                                    color: 'white',
                                    fontSize: '12px',
                                    fontFamily: 'sans-serif',

                                    listStyleType: 'disc',
                                    pl: 2,
                                    '& .MuiListItem-root': {
                                        display: 'list-item',
                                    },
                                }}>
                                    <ListItem>NFT ecosystem</ListItem>
                                    <ListItem>DeFi ecosystem</ListItem>
                                    {/* <ListItem>Transaction Speed</ListItem> */}

                                </List>
                            </Container>

                        </Card>
                    </Grid>

                </Grid>

            </Container>
        </>
    )
}

export default SoroBlockchains