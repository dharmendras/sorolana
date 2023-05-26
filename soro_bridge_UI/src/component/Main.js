import LandingPage from '@/pages/landingPages/LandingPage'
import React from 'react'
import { Box } from '@mui/material'
import LandingArrowSection from '@/pages/landingPages/LandingArrowSection'
import CrossChain from '@/pages/landingPages/CrossChain'
import SoroBlockchains from '@/pages/landingPages/SoroBlockchains'
import Trending from '@/pages/landingPages/Trending'
import HowWorks from '@/pages/landingPages/HowWorks'
import FollowUpdateCard from '@/pages/landingPages/FollowUpdateCard'
import Footer from './Footer'

function Main() {
    return (
        <>
            <Box sx={{ pt: 10 }}>
                <LandingPage />
                <LandingArrowSection />
                <CrossChain />
                <SoroBlockchains />
                <Trending />
                <HowWorks />
                <FollowUpdateCard />
                <Footer />
            </Box>

        </>
    )
}

export default Main