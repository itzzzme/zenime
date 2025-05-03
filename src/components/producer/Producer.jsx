import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Error from "../error/Error";
import Topten from "../topten/Topten";
import Genre from "../genres/Genre";
import SidecardLoader from "../Loader/Sidecard.loader";
import PageSlider from "../pageslider/PageSlider";
import CategoryCard from "../categorycard/CategoryCard";
import { useEffect, useState } from "react";
import { useHomeInfo } from "@/src/context/HomeInfoContext";
import getProducer from "@/src/utils/getProducer.utils";
import Loader from "../Loader/Loader";

function Producer() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [producerInfo, setProducerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const page = parseInt(searchParams.get("page")) || 1;
  const { homeInfo, homeInfoLoading } = useHomeInfo();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducerInfo = async () => {
      setLoading(true);
      try {
        const data = await getProducer(id, page);
        setProducerInfo(data.data);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (err) {
        setError(err);
        console.error("Error fetching category info:", err);
      }
    };
    fetchProducerInfo();
    window.scrollTo(0, 0);
  }, [id, page]);
  if (loading) return <Loader type="producer" />;
  if (error) {
    navigate("/error-page");
    return <Error />;
  }
  if (!producerInfo) {
    navigate("/404-not-found-page");
    return null;
  }
  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  return (
    <div className="w-full flex flex-col gap-y-4 mt-[100px] max-md:mt-[50px]">
      {producerInfo ? (
        <div className="w-full px-4 grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col max-[1200px]:gap-y-10">
          {page > totalPages ? (
            <p className="font-bold text-2xl text-[#ffbade] max-[478px]:text-[18px] max-[300px]:leading-6">
              You came a long way, go back <br className="max-[300px]:hidden" />
              nothing is here
            </p>
          ) : (
            <div>
              {producerInfo && (
                <CategoryCard
                  label={
                    (id.charAt(0).toUpperCase() + id.slice(1))
                      .split("-")
                      .join(" ") + " Anime"
                  }
                  data={producerInfo}
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
export default Producer;
