import styled from 'styled-components';
import theme from '@/style/theme';

const { colors } = theme;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: 100%;
`;

export const TagsContainer = styled.div`
    cursor: default;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 10px;
    font-size: 0.9rem;
`;

export const TagsItem = styled.div`
    background-color: ${colors.light};
    padding: 5px;
    font-size: 0.9rem;
    color: ${colors.dark};
    display: flex;
    gap: 5px;
    align-items: center;
`;