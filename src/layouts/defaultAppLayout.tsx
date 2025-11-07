import Navbar from '@/components/navbar'

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