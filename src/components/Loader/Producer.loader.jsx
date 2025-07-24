import CategoryCardLoader from "./CategoryCard.loader";
import SidecardLoader from "./Sidecard.loader";

function ProducerLoader() {
  return (
    <div className="w-full mt-[100px] flex flex-col gap-y-4 max-md:mt-[50px]">
      <div className="w-full px-4 grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col max-[1200px]:gap-y-10">
        <CategoryCardLoader className={"mt-[0px]"} />
        <SidecardLoader />
      </div>
    </div>
  );
}

export default ProducerLoader;
