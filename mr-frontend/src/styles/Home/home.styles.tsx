import styled from "styled-components";

export const Container = styled.div`
  font-size: clamp(4rem, 6vw, 4rem);
  font-weight: 900;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ContainerLeft = styled.div`
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
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 25vh;

  & > * {
    max-width: 50%;
    text-align: center;
    padding-right: 5vw;
  }
`;
