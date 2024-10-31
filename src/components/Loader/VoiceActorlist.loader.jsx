import { Skeleton } from "../ui/Skeleton/Skeleton"

function VoiceActorlistLoader() {
    return (
        <div className="w-full h-fit grid grid-cols-2 gap-4 overflow-y-hidden max-sm:gap-2 max-md:h-[400px] max-md:flex max-md:flex-col">
            {[...Array(10)].map((_, index) => (
                <div key={index} className="h-[80px] p-4 rounded-md bg-[#444445]">
                    <div className="flex h-full items-center gap-x-2">
                        <Skeleton className="w-[45px] h-[45px] rounded-full max-sm:w-[30px] max-sm:h-[30px]" />
                        <div className="flex flex-col gap-y-1">
                            <Skeleton className="h-[10px] w-[100px] rounded-md max-[300px]:w-[50px] max-[300px]:h-[8px]" />
                            <Skeleton className="h-[10px] w-[70px] rounded-md max-[300px]:w-[20px] max-[300px]:h-[8px]" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default VoiceActorlistLoader