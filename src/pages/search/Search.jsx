import CategoryCard from '@/src/components/categorycard/CategoryCard';
import Genre from '@/src/components/genres/Genre';
import CategoryCardLoader from '@/src/components/Loader/CategoryCard.loader';
import SidecardLoader from '@/src/components/Loader/Sidecard.loader';
import PageSlider from '@/src/components/pageslider/PageSlider';
import Sidecard from '@/src/components/sidecard/Sidecard';
import { useHomeInfo } from '@/src/context/HomeInfoContext';
import getSearch from '@/src/utils/getSearch.utils';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function Search() {
    const { homeInfo, homeInfoLoading } = useHomeInfo();
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const [searchData, setSearchData] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearch = async () => {
            setLoading(true);
            try {
                const data = await getSearch(keyword);
                setSearchData(data.data);
                setTotalPages(data.totalPage);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching anime info:", err);
                setError(err);
                setLoading(false);
            }
        };
        fetchSearch();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [keyword, page]);

    const handlePageChange = (newPage) => {
        setSearchParams({ keyword, page: newPage });
    };
    return (
        <div className='w-full px-4 mt-[128px] grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col max-[1200px]:gap-y-10 max-custom-md:mt-[80px] max-[478px]:mt-[60px]'>
            {loading ? (
                <CategoryCardLoader className={"max-[478px]:mt-2"} />
            ) : page > totalPages ? <p className='font-bold text-2xl text-[#ffbade] max-[478px]:text-[18px] max-[300px]:leading-6'>You came a long way, go back <br className='max-[300px]:hidden' />nothing is here</p> : searchData && searchData.length > 0 ? (
                <div>
                    <CategoryCard
                        label={`Search results for: ${keyword}`}
                        data={searchData}
                        showViewMore={false}
                        className={"mt-0"}
                    />
                    <PageSlider page={page} totalPages={totalPages} handlePageChange={handlePageChange} />
                </div>
            ) : error ? <p className='font-bold text-2xl text-[#ffbade] max-[478px]:text-[18px]'>Couldn&apos;t get search result please try again</p> : (
                <h1 className='font-bold text-2xl text-[#ffbade] max-[478px]:text-[18px]'>{`Search results for: ${keyword}`}</h1>
            )}
            <div className="w-full flex flex-col gap-y-10">
                {homeInfoLoading ? (
                    <SidecardLoader />
                ) : (
                    <>
                        {homeInfo?.most_popular && <Sidecard data={homeInfo.most_popular} className="mt-0" label="Most Popular" />}
                        {homeInfo?.genres && <Genre data={homeInfo.genres} />}
                    </>
                )}
            </div>
        </div>
    );
}

export default Search;
