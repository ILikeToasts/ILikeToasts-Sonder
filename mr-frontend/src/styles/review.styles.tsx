import styled from "styled-components";

export const ReviewContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ReviewBox = styled.div`
  width: 600px;
  margin-bottom: 20px;
`;

export const ReviewTextSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TitleSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ReviewTitle = styled.h1`
  font-family: "Raleway", sans-serif;
  font-optical-sizing: auto;
  font-weight: 800;
  font-style: normal;
  font-size: 2rem;
  text-decoration: underline;
  margin-bottom: 0.5rem;
  margin-right: 1rem;
`;

export const ArtistStats = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ReviewSubtitle = styled.h2`
  font-family: "Raleway", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
`;

export const ArtistInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Raleway", sans-serif;
  font-weight: 500;
  font-style: normal;
`;

export const RecommendationSection = styled.div`
  align-self: center;
  max-width: 50%;
  display: flex;
  justify-content: space-evenly;
`;

export const Titles = styled.div`
  max-width: 70%;
`;
