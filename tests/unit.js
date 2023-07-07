const { TvShow, Movie, Episode } = require('../MediaItems');
const { EpisodesRepository } = require('../repositories/EpisodesRepository');
const { MoviesRepository } = require('../repositories/MoviesRepository');
const { SeasonsRepository } = require('../repositories/SeasonsRepository');
const { SeriesRepository } = require('../repositories/SeriesRepository');
const { TvShowsRepository } = require('../repositories/TvShowsRepository');
const { expect } = require('@jest/globals')

describe("Unit tests", () => {
  test('Repository manages class reference', () => {
    let episodes = new EpisodesRepository();
    let episode = episodes.create({ title: "TvShow title" })
    expect(episode).toBeInstanceOf(Episode)
  });


  test('Movies repository "all()" methods returning correct object type', () => {
    let movies = new MoviesRepository();
    movies.create({ title: "Movie title" })
    movies.all().forEach(_movie => {
      expect(_movie).toBeInstanceOf(Movie);
    })
  })

  test('TvShows repository "all()" methods returning correct object type', () => {
    let tvShows = new TvShowsRepository();
    tvShows.create({ title: "Fake TvShow title" })
    tvShows.all().forEach(_tvShow => {
      expect(_tvShow).toBeInstanceOf(TvShow);
    })
  })

  test('Episodes provides parent reference in JSON representation', () => {
    let episodes = new EpisodesRepository();
    let episode = episodes.create({ title: "Fake episode title" })
    let json = episode.toJson();
    expect(json.parent).not.toBeUndefined()
  })

  test('Seasons provides parent reference in JSON representation', () => {
    let seasons = new EpisodesRepository();
    let season = seasons.create({ title: "Fake season title" })
    let json = season.toJson();
    expect(json.parent).not.toBeUndefined()
  })

  test('Add seasons and it results in repository, create empty episodes repository and it\'s empty', () => {
    let seasons = new SeasonsRepository();
    let episodes = new EpisodesRepository();
    let season = seasons.create({ title: "Fake season title" })
    expect(seasons.all().length).toBeGreaterThan(0)
    expect(episodes.all().length).toBe(0)

  })

  test('Add season and attach to new series, then detach and delete it', () => {
    let seasons = new SeasonsRepository();
    let serieses = new SeriesRepository();
    let seasonTitle = "Fake season title";
    let season = seasons.create({ title: seasonTitle })
    let series = serieses.create({ title: "Fake series title" })

    season.parent = series;
    series.seasons.add(season)

    expect(season.toJson().parent).not.toBeNull()
    expect(series.toJson().seasons.length).toBeGreaterThan(0)
    expect(series.toJson().seasons[0].title).toBe(seasonTitle)

    seasons.delete(season)
    expect(series.toJson().seasons.length).toBe(0)

  })

  test('Add season and attach to new tvShow, then detach and delete it', () => {
    let seasons = new SeasonsRepository();
    let tvShows = new TvShowsRepository();
    let seasonTitle = "Fake season title";
    let season = seasons.create({ title: seasonTitle })
    let tvShow = tvShows.create({ title: "Fake tvShow title" })

    season.parent = tvShow;
    tvShow.seasons.add(season)

    expect(season.toJson().parent).not.toBeNull()
    expect(tvShow.toJson().seasons.length).toBeGreaterThan(0)
    expect(tvShow.toJson().seasons[0].title).toBe(seasonTitle)

    seasons.delete(season)
    expect(tvShow.toJson().seasons.length).toBe(0)

  })

  test('Add episode and attach to new season, then detach and delete it', () => {
    let episodes = new EpisodesRepository();
    let seasons = new SeasonsRepository();

    let episodeTitle = "Fake episode title";
    let seasonTitle = "Fake season title";

    let episode = episodes.create({ title: episodeTitle })
    let season = seasons.create({ title: seasonTitle })

    episode.parent = season;
    season.episodes.add(episode)

    expect(episode.toJson().parent).not.toBeNull()
    expect(season.toJson().episodes.length).toBeGreaterThan(0)
    expect(season.toJson().episodes[0].title).toBe(episodeTitle)

    episodes.delete(episode)
    expect(season.toJson().episodes.length).toBe(0)

  })

  test('Add episode and attach to new movie, then detach and delete it', () => {
    let episodes = new EpisodesRepository();
    let movies = new MoviesRepository();

    let episodeTitle = "Fake episode title";
    let movieTitle = "Fake movie title";

    let episode = episodes.create({ title: episodeTitle })
    let movie = movies.create({ title: movieTitle })

    episode.parent = movie;
    movie.episodes.add(episode)

    expect(episode.toJson().parent).not.toBeNull()
    expect(movie.toJson().episodes.length).toBeGreaterThan(0)
    expect(movie.toJson().episodes[0].title).toBe(episodeTitle)

    episodes.delete(episode)
    expect(movie.toJson().episodes.length).toBe(0)

  })
})

