import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import getCategoryInfo from "@/src/utils/getCategoryInfo.utils";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Genre from "@/src/components/genres/Genre";
import Topten from "@/src/components/topten/Topten";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import { useNavigate } from "react-router-dom";
import { useHomeInfo } from "@/src/context/HomeInfoContext";
import PageSlider from "@/src/components/pageslider/PageSlider";
import SidecardLoader from "@/src/components/Loader/Sidecard.loader";

function Category({ path, label }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const page = parseInt(searchParams.get("page")) || 1;
  const { homeInfo, homeInfoLoading } = useHomeInfo();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategoryInfo = async () => {
      setLoading(true);
      try {
        const data = await getCategoryInfo(path, page);
        setCategoryInfo(data.data);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (err) {
        setError(err);
        console.error("Error fetching category info:", err);
      }
    };
    fetchCategoryInfo();
    window.scrollTo(0, 0);
  }, [path, page]);
  if (loading) return <Loader type="category" />;
  if (error) {
    navigate("/error-page");
    return <Error />;
  }
  if (!categoryInfo) {
    navigate("/404-not-found-page");
    return null;
  }
  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  return (
    <div className="w-full flex flex-col gap-y-4 mt-[64px] max-md:mt-[50px]">
      <div className="w-full flex gap-x-4 items-center bg-[#191826] p-5 max-[575px]:px-3 max-[320px]:hidden">
        <img
          src="https://s11.gifyu.com/images/SBdmo.gif"
          alt="Share Anime"
          className="w-[60px] h-auto rounded-full max-[1024px]:w-[40px] max-[575px]:hidden"
        />
        <div className="flex flex-col w-fit">
          <p className="text-[15px] font-bold text-[#FFBADE]">Share Anime</p>
          <p className="text-[16px] text-white">to your friends</p>
        </div>
      </div>
      {categoryInfo ? (
        <div className="w-full px-4 grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col max-[1200px]:gap-y-10">
          {page > totalPages ? (
            <p className="font-bold text-2xl text-[#ffbade] max-[478px]:text-[18px] max-[300px]:leading-6">
              You came a long way, go back <br className="max-[300px]:hidden" />
              nothing is here
            </p>
          ) : (
            <div>
              {categoryInfo && categoryInfo.length > 0 && (
                <CategoryCard
                  label={label.split("/").pop()}
                  data={categoryInfo}
                  showViewMore={false}
                  className={"mt-0"}
                  categoryPage={true}
                />
              )}
              <PageSlider
                page={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
          <div className="w-full flex flex-col gap-y-10">
            {homeInfoLoading ? (
              <SidecardLoader />
            ) : (
              <>
                {homeInfo && homeInfo.topten && (
                  <Topten data={homeInfo.topten} className="mt-0" />
                )}
                {homeInfo?.genres && <Genre data={homeInfo.genres} />}
              </>
            )}
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Category;
