import { AnimatePresence, useScroll } from 'framer-motion';
import { useState } from 'react';
import { AiFillCaretRight } from 'react-icons/ai';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { getUpcomingMovies, IGetMoviesResult } from '../../api';
import {
  SliderTitle,
  Slider,
  Row,
  Info,
  Box,
  Button,
  Overlay,
  BigMovie,
  BigCover,
  BigTitle,
  BigOverview,
  rowVariants,
  infoVariants,
  boxVariants,
} from '../Style';
import { makeImagePath } from '../../utils';

const offset = 6;

function UpcommingMovies() {
  const { data } = useQuery<IGetMoviesResult>(
    ['movies', 'upcommingMovies'],
    getUpcomingMovies
  );

  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(
    '/nomflix/movies/:movieId'
  );
  const { scrollY } = useScroll();
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(`/nomflix/movies/${movieId}`);
  };

  const onOverlayClick = () => {
    history.push(`/nomflix`);
  };

  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);

  return (
    <>
      <Slider
        style={{
          top: 700,
        }}
      >
        <SliderTitle>Upcoming Movies</SliderTitle>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            transition={{ type: 'tween', duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={movie.id + ''}
                  key={movie.id}
                  whileHover='hover'
                  initial='normal'
                  variants={boxVariants}
                  onClick={() => onBoxClicked(movie.id)}
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
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigMovie
              style={{ top: scrollY.get() + 100 }}
              layoutId={bigMovieMatch.params.movieId}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    bgPhoto={makeImagePath(clickedMovie.poster_path || '')}
                  />
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>{clickedMovie.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default UpcommingMovies;
