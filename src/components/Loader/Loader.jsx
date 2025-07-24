import AnimeInfoLoader from "./AnimeInfo.loader";
import HomeLoader from "./Home.loader";
import CategoryLoader from "./Category.loader";
import AtoZLoader from "./AtoZ.loader";
import ProducerLoader from "./Producer.loader";

const Loader = ({ type }) => {
  switch (type) {
    case "home":
      return <HomeLoader />;
    case "animeInfo":
      return <AnimeInfoLoader />;
    case "category":
      return <CategoryLoader />;
    case "producer":
      return <ProducerLoader />;
    case "AtoZ":
      return <AtoZLoader />;
    default:
      return <div className="loading-skeleton default-skeleton"></div>;
  }
};

export default Loader;
