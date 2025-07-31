import { Skeleton } from "../ui/Skeleton/Skeleton"
const SkeletonItems = ({ count, className }) => (
    [...Array(count)].map((_, index) => <Skeleton key={index} className={className} />)
);
function SpotlightLoader() {
    return (
        <section className="w-full h-[600px] max-[1390px]:h-[530px] max-[1300px]:h-[500px] max-md:h-[420px] relative">
            <div className="absolute flex flex-col left-0 bottom-[100px] w-[55%] p-4 z-10 max-[1390px]:w-[45%] max-[1390px]:bottom-[10px] max-[1300px]:w-[600px] max-[1120px]:w-[60%] max-md:w-[90%] max-[300px]:w-full">
                <Skeleton className="w-[400px] h-[20px] max-md:w-[180px]" />
                <Skeleton className="w-[70%] h-[20px] mt-6 text-left max-[1300px]:mt-4  max-sm:w-[80%] max-[320px]:w-full " />
                <div className="flex h-fit justify-center items-center w-fit space-x-5 mt-8 max-[1300px]:mt-6 max-md:hidden">
                    <SkeletonItems count={2} className="w-[30px] h-[15px]" />
                    <div className="flex space-x-3 w-fit">
                        <Skeleton className="w-[80px] h-[15px]" />
                        <div className='flex space-x-[1px] rounded-r-[5px] rounded-l-[5px] w-fit py-[1px] overflow-hidden'>
                            <SkeletonItems count={2} className="w-[30px] h-[15px]" />
                        </div>
                    </div>
                </div>
                <div className="mt-6 max-[1300px]:w-[500px] flex flex-col gap-y-2 max-[1120px]:w-[90%] max-md:hidden">
                    <Skeleton className="w-full h-[13px]" />
                    <Skeleton className="w-[85%] h-[13px]" />
                    <Skeleton className="w-[70%] h-[13px]" />
                </div>
                <div className='flex gap-x-5 mt-10 max-md:mt-6 max-sm:w-full max-[320px]:flex-col max-[320px]:space-y-3'>
                    <Skeleton className="w-[170px] h-[40px] max-[575px]:w-[120px] max-[575px]:h-[30px]" />
                    <Skeleton className="w-[150px] h-[40px] max-[575px]:w-[120px] max-[575px]:h-[30px]" />
                </div>
            </div>
        </section >
    )
}

export default SpotlightLoader