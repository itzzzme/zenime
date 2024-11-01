import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomeInfoProvider } from './context/HomeInfoContext';
import Home from "./pages/Home/Home";
import AnimeInfo from "./pages/animeInfo/AnimeInfo";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Error from './components/error/Error';
import Category from './pages/category/Category';
import AtoZ from './pages/a2z/AtoZ';
import { azRoute, categoryRoutes } from './utils/category.utils';
import './App.css';
import Search from './pages/search/Search';
import Watch from './pages/watch/Watch';

function App() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <HomeInfoProvider>
            <div className="app-container">
                <main className="content">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/:id" element={<AnimeInfo />} />
                        <Route path="/watch/:id" element={<Watch />} />
                        <Route path="/random" element={<AnimeInfo random={true} />} />
                        <Route path="/404-not-found-page" element={<Error error="404" />} />
                        <Route path="/error-page" element={<Error />} />
                        {categoryRoutes.map((path) => (
                            <Route
                                key={path}
                                path={`/${path}`}
                                element={<Category path={path} label={path.split('-').join(' ')} />}
                            />
                        ))}
                        {azRoute.map((path) => (
                            <Route
                                key={path}
                                path={`/${path}`}
                                element={<AtoZ path={path} />}
                            />
                        ))}
                        <Route path="/search" element={<Search />} />
                        <Route path="*" element={<Error error="404" />} />
                    </Routes>
                    <Footer />
                </main>
            </div>
        </HomeInfoProvider>
    );
}

export default App;
