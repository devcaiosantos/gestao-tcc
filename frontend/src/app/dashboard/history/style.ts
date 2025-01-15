import styled from "styled-components";


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const TitlePage = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
`;

export const StudentInfo = styled.div`
    margin-bottom: 0.5;
    padding: 1rem 1.5rem;
    
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    p {
        font-size: 1rem;
    }
`;

export const HistoryContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const HistoryItem = styled.div`
    background-color: #fff;
    padding: 1rem 1.5rem;
    border-left: 5px solid #4caf50;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .status {
        color: #4caf50;
        font-weight: bold;
    }

    .stage {
        color: #555;
    }

    .date {
        font-size: 0.9rem;
        color: #888;
    }
`;

export const Observation = styled.div`
    background-color: #f1f8e9;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    color: #4caf50;
`;
