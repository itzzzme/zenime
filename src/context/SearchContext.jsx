import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();
export function SearchProvider({ children }) {
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    return (
        <SearchContext.Provider value={{ isSearchVisible, setIsSearchVisible }}>
            {children}
        </SearchContext.Provider>
    );
}
export const useSearchContext = () => useContext(SearchContext);