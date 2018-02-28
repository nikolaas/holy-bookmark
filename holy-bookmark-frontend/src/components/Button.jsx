import PropTypes from "prop-types";
import styled from 'styled-components';
import theme, { lighten } from "../theme";

export const Button = styled.button`
    padding: .5em 1em;
    color: ${props => props.invert ? theme.color.primary : theme.color.primaryInvert};
    background: ${props => props.invert ? theme.color.primaryInvert : theme.color.primary};
    border: 2px solid ${theme.color.primary};
    outline: none;
    border-radius: 4px;
    text-decoration: none;
    transition: background .2s linear, color .2s linear, border, .2s linear;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
    font-size: inherit;
    
    &:active,
    &:focus,
    &:hover {
        text-decoration: none;
        background: ${props => props.invert ? theme.color.primary : theme.color.primaryInvert};
        color: ${props => props.invert ? theme.color.primaryInvert : theme.color.primary};
        
        background: ${props => props.invert ? lighten(theme.color.primary, 0.2) : lighten(theme.color.primary, 0.2)};
        border: 2px solid ${lighten(theme.color.primary, 0.2)};
        color: ${theme.color.primaryInvert};
    }
`;

Button.propTypes = {
    invert: PropTypes.bool,
};

Button.defaultProps = {
    invert: false,
};
