import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Suggestion from "../suggestion/Suggestion";
import useSearch from "@/src/hooks/useSearch";
import { useNavigate } from "react-router-dom";

function WebSearch() {
    const navigate = useNavigate();
    const {
        setIsSearchVisible,
        searchValue,
        setSearchValue,
        isFocused,
        setIsFocused,
        debouncedValue,
        suggestionRefs,
        addSuggestionRef,
    } = useSearch();

    const handleSearchClick = () => {
        if (window.innerWidth <= 600) {
            setIsSearchVisible((prev) => !prev);
        }
        if (searchValue.trim() && window.innerWidth > 600) {
            navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
        }
    };

    return (
        <div className="flex items-center relative w-[380px] max-[600px]:w-fit">
            <input
                type="text"
                className="bg-white px-4 py-2 text-black focus:outline-none w-full max-[600px]:hidden"
                placeholder="Search anime..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setTimeout(() => {
                        const isInsideSuggestionBox = suggestionRefs.current.some(
                            (ref) => ref && ref.contains(document.activeElement),
                        );
                        if (!isInsideSuggestionBox) {
                            setIsFocused(false);
                        }
                    }, 100);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        if (searchValue.trim()) {
                            navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
                        }
                    }
                }}
            />
            <button
                className="bg-white p-2 max-[600px]:bg-transparent focus:outline-none max-[600px]:p-0"
                onClick={handleSearchClick}
            >
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-lg text-black hover:text-[#ffbade] max-[600px]:text-white max-[600px]:text-2xl max-[575px]:text-xl max-[600px]:mt-[7px]"
                />
            </button>
            {searchValue.trim() && isFocused && (
                <div
                    ref={addSuggestionRef}
                    className="absolute z-[100000] top-full w-full"
                >
                    <Suggestion keyword={debouncedValue} className="w-full" />
                </div>
            )}
        </div>
    );
}

export default WebSearch;
