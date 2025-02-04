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

export const HistoryItem = styled.div<{statusColor: string}>`
    background-color:rgb(68, 68, 68);
    padding: 1rem 1.5rem;
    border-left: 5px solid ${({statusColor}) => statusColor};
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .status {
        color:${({statusColor}) => statusColor};
        font-weight: bold;
    }

    .stage {
        color: #cccccc;
    }

    .date {
        font-size: 0.9rem;
        color: rgb(183, 181, 181);
    }
`;

export const Observation = styled.div<{statusColor: string}>`
    background-color: rgb(45, 45, 45);
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    color: ${({statusColor}) => statusColor};
`;
