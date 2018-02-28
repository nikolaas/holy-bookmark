import PropTypes from "prop-types";
import { Link } from './Link';
import { Button } from './Button';

export const ButtonLink = Button.withComponent(Link);

ButtonLink.propTypes = {
    to: PropTypes.string.isRequired,
    target: PropTypes.string,
    title: PropTypes.string,
    invert: PropTypes.bool,
};

ButtonLink.defaultProps = {
    target: null,
    title: null,
    invert: false,
};
