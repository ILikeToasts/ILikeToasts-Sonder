import styled from "styled-components";

export const InformationSection = styled.div``;

export const MusicalStyle = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

export const Secondbox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 5rem;
  justify-content: space-evenly;
`;

export const ArtistReviewContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  font-family: "Raleway", sans-serif;
  font-weight: 500;
  font-style: normal;
  overflow: hidden;
`;

export const Title = styled.div`
  font-family: "Raleway", sans-serif;
  font-weight: 900;
  font-style: normal;
  font-size: 2rem;
  margin-bottom: 20px;
  justify-self: center;
`;

export const ArtistTitle = styled(Title)`
  justify-self: flex-start;
`;
