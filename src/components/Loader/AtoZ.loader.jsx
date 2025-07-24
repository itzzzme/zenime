import { Skeleton } from "../ui/Skeleton/Skeleton";
import CategoryCardLoader from "./CategoryCard.loader";

const SkeletonItems = ({ count, className }) => (
    [...Array(count)].map((_, index) => <Skeleton key={index} className={className} />)
);

function AtoZLoader() {
    return (
        <div className="max-w-[1260px] mx-auto px-[15px] flex flex-col mt-[64px] max-md:mt-[50px]">
            <ul className="flex gap-x-4 mt-[50px] items-center w-fit max-[1200px]:hidden">
                <Skeleton className="w-[50px] h-[15px]" />
                <Skeleton className="w-[70px] h-[15px]" />
            </ul>
            <div className="flex flex-col gap-y-5 mt-6">
                <Skeleton className="w-[200px] h-[15px]" />
                <div className='flex gap-x-[7px] flex-wrap justify-start gap-y-2 max-md:justify-start'>
                    <SkeletonItems count={20} className="w-[40px] h-[20px] rounded-sm"/>
                </div>
            </div>
            <CategoryCardLoader showLabelSkeleton={false}/>
        </div >
    );
}

export default AtoZLoader;
