"use client";

import styled from "styled-components";

const StyledH1 = styled.h1`
  color: #0070f3;
  font-size: 50px;
`;

export default function Home() {
  return (
    <div>
      <StyledH1>
        Hello World
      </StyledH1>
    </div>
  );
}
