import Suggestion from '../suggestion/Suggestion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import useSearch from '@/src/hooks/useSearch';
import { useNavigate } from 'react-router-dom';

function MobileSearch() {
    const navigate = useNavigate();
    const {
        isSearchVisible,
        searchValue,
        setSearchValue,
        isFocused,
        setIsFocused,
        debouncedValue,
        suggestionRefs,
        addSuggestionRef,
    } = useSearch();
    const handleSearchClick = () => {
        if (searchValue.trim() && window.innerWidth <= 600) {
            navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
        }
    };
    return (
        <>
            {isSearchVisible && (
                <div className="flex w-full mt-2 relative custom-md:hidden ">
                    <input
                        type="text"
                        className="bg-white px-4 py-2 text-black focus:outline-none w-full rounded-l-md"
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
                                handleSearchClick();
                            }
                        }}
                    />
                    <button className="flex items-center justify-center p-2 bg-white rounded-r-md"
                        onClick={handleSearchClick}
                    >
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="text-black text-lg"
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
            )}
        </>
    );
}

export default MobileSearch;
