import { Skeleton } from "../ui/Skeleton/Skeleton";
function SidecardLoader({ className }) {
    return (
        <div className={`flex flex-col space-y-6 ${className}`}>
            <Skeleton className='w-[200px] h-[15px]' />
            <div className='flex flex-col space-y-4 bg-[#2B2A3C] p-4 pt-8 w-full'>
                {[...Array(10)].map((_, index) => (
                    <div key={index} className='flex items-center gap-x-4'>
                        <div className="flex pb-4 relative container items-center">
                            <Skeleton className="w-[60px] h-[75px] rounded-md" />
                            <div className='flex flex-col ml-4 space-y-2 w-[60%]'>
                                <Skeleton className='w-[90%] h-[15px]' />
                                <div className='flex flex-wrap items-center space-x-1'>
                                    <Skeleton className="w-[30%] h-[15px]" />
                                    <Skeleton className="w-[30%] h-[15px]" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SidecardLoader;
