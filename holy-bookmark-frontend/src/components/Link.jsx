import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link as RouterLink } from "react-router-dom";

export const Link = styled(RouterLink)`
    text-decoration: none;
`;

Link.propTypes = {
    to: PropTypes.string.isRequired,
    target: PropTypes.string,
    title: PropTypes.string,
};

Link.defaultProps = {
    target: null,
    title: null,
};
