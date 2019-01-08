const axios = require('axios'),
      version = '3',
      baseURL = `https://api.themoviedb.org/${version}`,
      key = process.env.MOVIEDB_APIKEY;

class MDB{
  constructor(){
    /**** CONFIGURATION VALUES
    ** these values are hardcoded from the /configuration endpoint
    ** rather than make network calls every time to get these,
    ** I'm hardcoding them. Last updated on 01/07/2018.
    ** If images start getting 404's, check to make sure these values are still accurate */
    this.config = {
      "images": {
        "base_url": "http://image.tmdb.org/t/p/",
        "secure_base_url": "https://image.tmdb.org/t/p/",
        "backdrop_sizes": [
          "w300",
          "w780",
          "w1280",
          "original"
        ],
        "logo_sizes": [
          "w45",
          "w92",
          "w154",
          "w185",
          "w300",
          "w500",
          "original"
        ],
        "poster_sizes": [
          "w92",
          "w154",
          "w185",
          "w342",
          "w500",
          "w780",
          "original"
        ],
        "profile_sizes": [
          "w45",
          "w185",
          "h632",
          "original"
        ],
        "still_sizes": [
          "w92",
          "w185",
          "w300",
          "original"
        ]
      },
      "change_keys": [
        "adult",
        "air_date",
        "also_known_as",
        "alternative_titles",
        "biography",
        "birthday",
        "budget",
        "cast",
        "certifications",
        "character_names",
        "created_by",
        "crew",
        "deathday",
        "episode",
        "episode_number",
        "episode_run_time",
        "freebase_id",
        "freebase_mid",
        "general",
        "genres",
        "guest_stars",
        "homepage",
        "images",
        "imdb_id",
        "languages",
        "name",
        "network",
        "origin_country",
        "original_name",
        "original_title",
        "overview",
        "parts",
        "place_of_birth",
        "plot_keywords",
        "production_code",
        "production_companies",
        "production_countries",
        "releases",
        "revenue",
        "runtime",
        "season",
        "season_number",
        "season_regular",
        "spoken_languages",
        "status",
        "tagline",
        "title",
        "translations",
        "tvdb_id",
        "tvrage_id",
        "type",
        "video",
        "videos"
      ]
    }
  }

  getGenreList(type='movie'){
    if(type && (type == 'movie' || type == 'tv')){
        return axios.get(`${baseURL}/genre/${type}/list?api_key=${key}`);
    } else{ return Promise.resolve(''); }
  }

  /** MOVIE FUNCTIONS **/
  // since many of the calls are similar,
  // this wrapper takes the id, endpoint, and any additional options
  movieInfoWrapper(id, endpoint, options){
    let query = '';
    if(options && typeof options == 'object'){
      for(let i in options){
        query += `&${i}=${options[encodeURIComponent(i)]}`;
      }
    }
    if(id){ return axios.get(`${baseURL}/movie/${id}${endpoint ? `/${endpoint}` : ''}?api_key=${key}${query}`); }
    else{ return Promise.resolve(''); }
  }

  getExternalIDs(id){ return this.movieInfoWrapper(id, 'external_ids')}
  getMovieByID(id, appendToResponse){ return this.movieInfoWrapper(id,'',{ append_to_response : appendToResponse ? appendToResponse : '' })}
  getCredits(id){ return this.movieInfoWrapper(id, 'credits'); }
  getImages(id){ return this.movieInfoWrapper(id, 'images'); }
  getReleaseDates(id){ return movieInfoWrapper(id, 'release_dates'); }
  // note: recommendations and similar are different
  getRecommendations(id, page){ return this.movieInfoWrapper(id, 'recommendations', {page: page ? page : 1}); }
  getSimilar(id, page){return this.movieInfoWrapper(id, 'similar', {page: page ? page : 1})};

  /**** SEARCH ****/
  searchWrapper(term, type = 'movie', options){
    if(term){
      term = encodeURIComponent(term);
      let params = `&query=${term}`;
      if(options && typeof options == 'object'){
        for(let i in options){
          params += `&${i}=${options[i]}`;
        }
      }
      return axios.get(`${baseURL}/search/${type}?api_key=${key}${params}`);
    } else{
      return Promise.resolve('');
    }
  }
  searchMovies(term, page){ return this.searchWrapper(term, {page : page ? page : 1}); }
  searchTV(term, page){ return this.searchWrapper(term, 'tv', {page: page ? page : 1}); }
  searchAll(term, page){ return this.searchWrapper(term, 'multi', {page: page ? page : 1}); }
  // this searches for available keywords, NOT for movies that match them.
  searchKeyword(term, page){ return this.searchWrapper(term, 'keyword', {page : page ? page : 1}); }
  // this will get all the movies that match a given keyword ID
  getMoviesByKeyword(keywordID, page){
    if(keywordID){
      return axios.get(`${baseURL}/keyword/${keywordID}/movies?api_key=${key}&page=${page ? page : 1}`)
    }
  }
};

export default new MDB();
