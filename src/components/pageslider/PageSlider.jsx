import { faAngleDoubleLeft, faAngleDoubleRight, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function PageSlider({ page, totalPages, handlePageChange, start = false, style }) {
    const renderPageNumbers = () => {
        const pages = [];
        if (totalPages === 1) return null;
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page === 1) {
                pages.push(1, 2, 3);
            } else if (page === 2) {
                pages.push(1, 2, 3, 4);
            } else if (page === totalPages) {
                pages.push(totalPages - 2, totalPages - 1, totalPages);
            } else if (page === totalPages - 1) {
                pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(page - 2, page - 1, page, page + 1, page + 2);
            }
        }
        return pages.map((p) => (
            <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-[40px] text-[15px] mx-1 flex justify-center items-center p-2 rounded-full font-bold ${page === p ? 'bg-[#ffbade] text-[#2B2A3C] cursor-default' : 'bg-[#2B2A3C]  text-[#999] hover:text-[#ffbade]'} ${start ? "bg-[#353537]" : "bg-[#2B2A3C]"} `}
            >
                {p}
            </button>
        ));
    };
    return (
        <div className={`w-full flex ${start ? "justify-start" : "justify-center"} items-center mt-12 overflow-hidden`} style={style}>
            <div className="flex justify-center mt-4 w-fit">
                {page > 1 && totalPages > 2 && (
                    <button
                        onClick={() => handlePageChange(1)}
                        className={`w-[40px] mx-1 p-2 ${start ? "bg-[#353537]" : "bg-[#2B2A3C]"} rounded-full text-[#999] text-[8px] hover:text-[#ffbade]`}
                    >
                        <FontAwesomeIcon icon={faAngleDoubleLeft} />
                    </button>
                )}
                {page > 1 && (
                    <button
                        onClick={() => { if (page > 0) handlePageChange(page - 1) }}
                        className={`w-[40px] mx-1 p-2 ${start ? "bg-[#353537]" : "bg-[#2B2A3C]"} rounded-full text-[#999] text-[8px] hover:text-[#ffbade]`}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                )}
                {renderPageNumbers()}
                {page < totalPages && (
                    <button
                        onClick={() => { if (page < totalPages) handlePageChange(page + 1) }}
                        className={`w-[40px] mx-1 p-2 ${start ? "bg-[#353537]" : "bg-[#2B2A3C]"} rounded-full text-[#999] text-[8px] hover:text-[#ffbade]`}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                )}
                {page < totalPages && totalPages > 2 && (
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`w-[40px] mx-1 p-2 ${start ? "bg-[#353537]" : "bg-[#2B2A3C]"} rounded-full text-[#999] text-[8px] hover:text-[#ffbade]`}
                    >
                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </button>
                )}
            </div>
        </div>
    )
}

export default PageSlider