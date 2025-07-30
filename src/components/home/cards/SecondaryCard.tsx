import styles from './SecondaryCard.module.scss'

const SecondaryCard = ({image, title, content}:{image:string, title:string, content:string}) => {
  return (
    <div
      className={`${styles.card} flex flex-col min-w-[210px] gap-2 items-center`}
    >
        <img src={image} className='h-[82px] '/>
        <h1 className='text-[#31C1BF] font-semibold text-[14px]'>{title}</h1>
        <p className='text-[12px] font-normal text-[#CCCCCC] text-left'>{content}</p>
      {/* Card content here */}
    </div>
  )
}

export default SecondaryCard