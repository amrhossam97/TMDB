# 🎬 Movies Domain

## Controllers
- **MoviesController**  
  - `/movie/Get-Movies/:skip/:take` : Get movies with filters and pagination  
  - `/movie/Get-Movies-By-Genre/:genreId/:skip/:take` : Get movies by genre  
  - `/movie/Get-Image-URL/:imgPath` : Get image URL  
  - `/movie/Add-To-Wishlist/:movieId` : Add movie to wishlist  
  - `/movie/Remove-From-Wishlist/:movieId` : Remove movie from wishlist  
  - `/movie/Mark-Move-Favorite/:movieId` : Mark movie as favorite  
  - `/movie/My-Wishlist/:skip/:take` : Get user's wishlist

## Services
- **MoviesService**  
  - `createOrSyncMovie(dto: MovieDto)`  
  - `getMovies(body, skip, take)`  
  - `getMoviesByGenre(body, genreId, skip, take)`  
  - `addToWishlist(movieId, user)`  
  - `removeFromWishlist(movieId, user)`  
  - `markMovieFavorite(movieId, user)`  
  - `getMyWishlist(user, skip, take)`

## DTOs
- `MovieDto`
- `GetMoviesFilterDTO`