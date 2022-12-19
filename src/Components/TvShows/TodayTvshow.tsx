import { AnimatePresence, useScroll } from 'framer-motion';
import { useState } from 'react';
import { AiFillCaretRight } from 'react-icons/ai';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { getAringToday, IGetTvResult } from '../../api';
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

function TodayTvshow() {
  const { data } = useQuery<IGetTvResult>(['tv', 'todayTvShow'], getAringToday);
  const { scrollY } = useScroll();

  const history = useHistory();
  const bigTvmatch = useRouteMatch<{ tvId: string }>('/nomflix/tv/:tvId');

  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    history.push(`/nomflix/tv/${tvId}`);
  };
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = data.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const onOverlayClick = () => {
    history.push(`/nomflix/tv`);
  };

  const clickedTvShow =
    bigTvmatch?.params.tvId &&
    data?.results.find((tv) => tv.id === +bigTvmatch.params.tvId);

  return (
    <>
      <Slider>
        <SliderTitle>Airing Today</SliderTitle>
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
              .map((tv) => (
                <Box
                  layoutId={tv.id + ''}
                  key={tv.id}
                  whileHover='hover'
                  initial='normal'
                  variants={boxVariants}
                  onClick={() => onBoxClicked(tv.id)}
                  transition={{ type: 'tween' }}
                  bgPhoto={makeImagePath(tv.backdrop_path, 'w500')}
                >
                  <Info variants={infoVariants}>
                    <h4>{tv.name}</h4>
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
        {bigTvmatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigMovie
              style={{ top: scrollY.get() + 100 }}
              layoutId={bigTvmatch.params.tvId}
            >
              {clickedTvShow && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedTvShow.backdrop_path,
                        'w500'
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedTvShow.name}</BigTitle>
                  <BigOverview>{clickedTvShow.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default TodayTvshow;
