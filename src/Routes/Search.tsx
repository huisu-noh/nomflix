import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AiFillCaretRight } from 'react-icons/ai';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import {
  getSearchMovies,
  getSearchTv,
  IGetTvResult,
  IGetMoviesResult,
} from '../api';
import {
  SliderTitle,
  Slider,
  Row,
  Info,
  Box,
  Button,
  rowVariants,
  infoVariants,
  boxVariants,
} from '../Components/Style';
import { makeImagePath } from '../utils';

const offset = 6;

function Search() {
  const [movieIndex, setMovieIndex] = useState(0);
  const [movieLeaving, setMovieLeaving] = useState(false);

  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('keyword');

  const { data: MovieData } = useQuery<IGetMoviesResult>(
    ['movie', keyword],
    () => getSearchMovies(keyword + '')
  );

  const toggleMovieLeaving = () => setMovieLeaving((prev) => !prev);

  const incraseIndex = () => {
    if (MovieData) {
      if (movieLeaving) return;
      toggleMovieLeaving();
      const totalMovies = MovieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMovieIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  return (
    <>
      <Slider style={{ top: 150 }}>
        <SliderTitle>"{keyword}" in search results</SliderTitle>
        <AnimatePresence initial={false} onExitComplete={toggleMovieLeaving}>
          <Row
            variants={rowVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            transition={{ type: 'tween', duration: 1 }}
            key={movieIndex}
          >
            {MovieData?.results
              .slice(offset * movieIndex, offset * movieIndex + offset)
              .map((movie) => (
                <Box
                  layoutId={movie.id + ''}
                  key={movie.id}
                  whileHover='hover'
                  initial='normal'
                  variants={boxVariants}
                  transition={{ type: 'tween' }}
                  bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <Button onClick={incraseIndex}>
          <AiFillCaretRight />
        </Button>
      </Slider>
    </>
  );
}

export default Search;
