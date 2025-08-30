import React from 'react'

const AnimeCard = ({ anime }) => {
    const { canonicalTitle, startDate, averageRating, episodeCount, posterImage } = anime.attributes;
    return (
        <div className="movie-card">
            <img src={posterImage.original} alt="/no-movie.png" />
            <div className="mt-4">
                <h3>{canonicalTitle}</h3>
                <div className="content">
                    <div className="rating">
                        <img src="/star.svg" alt="star" />
                        <p>{averageRating ? parseFloat(averageRating).toFixed(1) : 'N/A'}</p>
                    </div>
                    <span>·</span>
                    <p className="lang">{episodeCount ? `${episodeCount} Ep · ` : ''}</p>
                    <p className="year">{startDate ? startDate.split('-')[0] : 'N/A'}</p>
                </div>
            </div>
        </div>
    )
}
export default AnimeCard
