import Navbar from '@/components/navbar'
import React from 'react'

const DefaultAppLayout = (
    {MainContentComponent}:{MainContentComponent: any}
) => {
  return (
    <>
    <Navbar/>
    <MainContentComponent/>
    </>
  )
}

export default DefaultAppLayout