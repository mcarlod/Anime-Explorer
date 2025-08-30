import React, {useState, useEffect} from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import AnimeCard from './components/AnimeCard.jsx'

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

    const fetchAnime = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const endpoint = `${API_BASE_URL}/anime?page[limit]=20&page[offset]=0`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Failed to fetch anime');
            }

            const data = await response.json();
            if (data.Response === "False") {
                setErrorMessage(data.Response || 'Failed to fetch anime');
                setAnimeList([]);
                return;
            }

            setAnimeList(data.data || []);
        } catch(error){
            console.log(error)
            setErrorMessage('error')
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchAnime();
    }, [])

    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
                <section className="all-movies">
                    <h2 className="mt-[40px]">All Anime</h2>

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
            </div>

        </main>
    )
}
export default App
