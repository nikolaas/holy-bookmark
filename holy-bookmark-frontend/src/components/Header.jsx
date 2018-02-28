import React from 'react';
import styled from 'styled-components';
import theme from '../theme/index';

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
`;

const Motto = styled.p`
  margin-top: 2rem;
  font-size: ${theme.title.secondary.font.size};
`;

export const Header = () => {
    return (
        <StyledHeader>
            <Logo>Holy Bookmark</Logo>
            <Motto>There should be a beautiful motto but it's not there</Motto>
        </StyledHeader>
    );
};
