import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const BaseLink = styled(Link)`
cursor: pointer;
color: #ea9350;
background-color: #051306;
text-align: center;
  width: fit-content;
  padding: 2px 10px 2px 10px;
  border: 1px solid #F2F2F2;
  border-radius: 5px;
  text-align: center;
  font-family: 'Lalezar', cursive;
  font-size: 1rem;
  font-weight: 400;
  box-shadow: 1px 1px 8px 4px rgba(5, 19, 6, 0.3);
  transition: all 0.3s ease;
`;

export const HomeLink = styled(BaseLink)`
`;

export const DailyLink = styled(BaseLink)`
`;

export const ShelfLink = styled(BaseLink)`
`;

export const StatisticsLink = styled(BaseLink)`
`;

export const GetStartedLink = styled(BaseLink)`
`;

// from shelf to usage log
export const UsageLink = styled(BaseLink)`
`;