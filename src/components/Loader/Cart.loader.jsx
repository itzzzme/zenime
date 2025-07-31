import { Skeleton } from "../ui/Skeleton/Skeleton"
const SkeletonItems = ({ count, className }) => (
    [...Array(count)].map((_, index) => <Skeleton key={index} className={className} />)
);
function CartLoader() {
    return (
        <div className="flex flex-col w-1/4 space-y-7 max-[1200px]:w-full">
            <Skeleton className="w-[200px] h-[20px]" />
            <div className='w-full space-y-4 flex flex-col '>
                {[...Array(5)].map((item, index) => (
                    <div key={index} style={{ borderBottom: "1px solid rgba(255, 255, 255, .075)" }} className="flex pb-4 items-center">
                        <Skeleton className="w-[60px] h-[75px] rounded-none" />
                        <div className='flex flex-col ml-4 space-y-2 w-full'>
                            <Skeleton className='w-[90%] h-[15px]' />
                            <div className='flex items-center w-fit space-x-1'>
                                <SkeletonItems count={3} className="w-[30px] h-[15px]" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Skeleton className='w-[100px] h-[30px]' />
        </div>
    )
}

export default CartLoader