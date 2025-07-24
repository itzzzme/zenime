import { Skeleton } from "../ui/Skeleton/Skeleton"
import CategoryCardLoader from "./CategoryCard.loader"
import SidecardLoader from "./Sidecard.loader"

function CategoryLoader() {
    return (
        <div className='w-full flex flex-col gap-y-4 mt-[64px] max-md:mt-[50px]'>
            <div className="flex gap-x-4 items-center p-5 mt-4">
                <Skeleton className="w-[60px] h-[60px] rounded-full bg-gray-500 max-[575px]:hidden" />
                <div className="flex flex-col w-fit gap-y-2">
                    <Skeleton className="w-[150px] h-[10px] rounded-xl " />
                    <Skeleton className="w-[150px] h-[10px] rounded-xl " />
                </div>
            </div>
            <div className="w-full px-4 grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col max-[1200px]:gap-y-10">
                <CategoryCardLoader className={"mt-[0px]"} />
                <SidecardLoader />
            </div>
        </div>
    )
}

export default CategoryLoader