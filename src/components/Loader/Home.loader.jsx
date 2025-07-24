import CartLoader from "./Cart.loader";
import CategoryCardLoader from "./CategoryCard.loader";
import SidecardLoader from "./Sidecard.loader";
import SpotlightLoader from "./Spotlight.loader";
import Trendingloader from "./Trending.loader";
function HomeLoader() {
  return (
    <div className="px-4 w-full h-full  max-[1200px]:px-0 bg-[#3a395100]">
      <SpotlightLoader />
      <Trendingloader />
      <div className="mt-16 flex gap-6 max-[1200px]:px-4 max-[1200px]:grid max-[1200px]:grid-cols-2 max-[1200px]:mt-12 max-[1200px]:gap-y-10 max-[680px]:grid-cols-1">
        <CartLoader />
        <CartLoader />
        <CartLoader />
        <CartLoader />
      </div>
      <div className="w-full grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex flex-col max-[1200px]:px-4">
        <div>
          <CategoryCardLoader className="mt-[60px]" />
          <CategoryCardLoader className="mt-[60px]" />
          <CategoryCardLoader className="mt-[60px]" />
        </div>
        <div className="w-full mt-[60px]">
          <SidecardLoader />
          <SidecardLoader />
        </div>
      </div>
    </div>
  );
}

export default HomeLoader;
