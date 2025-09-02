import React, {useState, useEffect} from 'react'
import { useDebounce } from 'react-use'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import AnimeCard from './components/AnimeCard.jsx'
import {getTrendingAnime, updateSearchCount} from "./supabase.js";

const API_BASE_URL = 'https://kitsu.io/api/edge';
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [animeList, setAnimeList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [trendingAnime, setTrendingAnime] = useState([])
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useDebounce( () => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchAnime = async (query = '', offsetValue = 0) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const endpoint = query
                ? `${API_BASE_URL}/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=20&page[offset]=${offsetValue}`
                : `${API_BASE_URL}/anime?page[limit]=20&page[offset]=${offsetValue}`;

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error('Failed to fetch anime');
            }

            const data = await response.json();
            const results = data.data || [];

            setAnimeList(results);

            setHasMore(results.length === 20);

            if (query && results.length > 0) {
                await updateSearchCount(query, results[0]);
            }
        } catch(error){
            console.log(error)
            setErrorMessage('error')
        } finally {
            setIsLoading(false);
        }
    }

    const loadTrendingAnime = async () => {
        try {
            const anime = await getTrendingAnime()
            setTrendingAnime(anime);
        } catch (error) {
            console.log(`Error fetching trends: ${error}`)
        }
    }

    useEffect(() => {
        setOffset(0);
        fetchAnime(debouncedSearchTerm, 0);
    }, [debouncedSearchTerm])

    useEffect(() => {
        loadTrendingAnime();
    }, []);
    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1>Find <span className="text-gradient">Anime Shows</span> You'll Enjoy</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingAnime.length > 0 && (
                    <section className="trending">
                        <h2>Trending Anime</h2>
                        <ul>
                            {trendingAnime.map((anime, index) => (
                                <li key={anime.$id}>
                                    <p>{index + 1}</p>
                                    <img src={anime.posterImage} alt={anime.title} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="all-movies">
                    <h2>All Anime Shows</h2>

                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red">{errorMessage}</p>
                    ) : (
                        <ul>
                            {animeList.map((anime) => (
                                <AnimeCard key={anime.id} anime={anime} />
                            ))}
                        </ul>
                    )}
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                </section>
                <section className="pagination-buttons">
                    <button
                        onClick={() => {
                            const newOffset = Math.max(offset - 20, 0);
                            setOffset(newOffset);
                            fetchAnime(debouncedSearchTerm, newOffset);
                        }}
                        className="page-btn"
                        disabled={offset === 0}>
                        Previous Page
                    </button>

                    {hasMore && !isLoading && (
                        <button
                            onClick={() => {
                                const newOffset = offset + 20;
                                setOffset(newOffset);
                                fetchAnime(debouncedSearchTerm, newOffset);
                            }}
                            className="page-btn"
                        >
                            Next Page
                        </button>
                    )}
                </section>
            </div>
        </main>
    )
}
export default App
