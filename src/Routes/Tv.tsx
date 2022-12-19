import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getPopularTv, IGetTvResult } from '../api';
import PopularTvShow from '../Components/TvShows/PopularTvShow';
import TodayTvshow from '../Components/TvShows/TodayTvshow';
import TopRatedTvShow from '../Components/TvShows/TopRatedTvShow';
import { makeImagePath } from '../utils';

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 25px;
  width: 50%;
`;

function Tv() {
  const { isLoading, data } = useQuery<IGetTvResult>(
    ['tv', 'popularTvShow'],
    getPopularTv
  );
  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Banner
              bgPhoto={makeImagePath(data?.results[0].backdrop_path || '')}
            >
              <Title>{data?.results[0].name}</Title>
              <Overview>{data?.results[0].overview}</Overview>
            </Banner>
          </>
        )}
      </Wrapper>
      <PopularTvShow />
      <TopRatedTvShow />
      <TodayTvshow />
    </>
  );
}

export default Tv;
