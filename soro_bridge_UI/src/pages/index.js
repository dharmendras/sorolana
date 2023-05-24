import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Navbar from '@/component/Navbar'
import Main from '@/component/Main'

export default function Home() {
  return (
    <>
      <Navbar />
      <Main />
    </>
  )
}
