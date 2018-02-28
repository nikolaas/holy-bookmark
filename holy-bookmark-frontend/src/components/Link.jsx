// import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link as RouterLink } from "react-router-dom";
import theme from '../theme';

export const Link = styled(RouterLink)`
    padding: .5rem 1rem;
    background: ${props => props.invert ? theme.color.primaryInvert : theme.color.primary};
    color: ${props => props.invert ? theme.color.primary : theme.color.primaryInvert};
    border: 2px solid ${theme.color.primary};
    border-radius: 4px;
    text-decoration: none;
    transition: background .2s linear, color .2s linear;
    
    &:hover {
      text-decoration: none;
      background: ${props => props.invert ? theme.color.primary : theme.color.primaryInvert};
      color: ${props => props.invert ? theme.color.primaryInvert : theme.color.primary};
    }
`;

Link.propTypes = {
    invert: PropTypes.bool,
};

Link.defaultProps = {
    invert: false,
};
