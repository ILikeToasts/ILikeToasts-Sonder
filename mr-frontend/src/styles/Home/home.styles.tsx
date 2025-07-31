import styled from "styled-components";

export const TitleContainer = styled.div`
  font-size: clamp(4rem, 6vw, 4rem);
  font-weight: 900;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const HomeSubtitle = styled.div`
  font-family: "Raleway", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
  font-size: 1.5rem;
  align-items: center;
  justify-content: center;
`;

export const ContainerLeft = styled.div`
  font-family: "Raleway", sans-serif;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & > * {
    max-width: 50%;
    text-align: center;
    padding-left: 5vw;
    margin-bottom: 15vh;
  }
`;

export const ContainerRight = styled.div`
  font-family: "Raleway", sans-serif;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 4rem;

  & > * {
    max-width: 50%;
    text-align: center;
    padding-right: 5vw;
  }
`;
