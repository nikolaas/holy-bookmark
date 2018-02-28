import React from 'react';
import styled from 'styled-components';
import theme from '../theme';
import { Link } from '../components/Link';

const StyledHeader = styled.header`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
    background: ${theme.color.primary};
    color: ${theme.color.primaryInvert};
`;

const Logo = styled.h1`
    font-size: ${theme.title.primary.font.size};
  
    ${Link} {
        color: ${theme.color.primaryInvert};
    
        &:hover,
        &:focus,
        &:active,
        &:visited {
            color: ${theme.color.primaryInvert};
        }
    }
`;

const Motto = styled.p`
    margin-top: 2rem;
    font-size: ${theme.title.secondary.font.size};
`;

export const Header = () => {
    return (
        <StyledHeader>
            <Logo><Link to="/">Holy Bookmark</Link></Logo>
            <Motto>There should be a beautiful motto but it's not there</Motto>
        </StyledHeader>
    );
};
