import React from 'react';
import styled from 'styled-components';
import theme from '../theme';

const Input = styled.input`
    width: 100%;
    height: 2em;
    line-height: 2em;
    padding: 0 .5em;
    border: none;
    outline: none;
    font-size: inherit;
`;

const Placeholder = styled.span`
    position: absolute;
    left: .5em;
    bottom: .25em;
    transform: ${props => props.focused ? 'translateY(-2.5em)' : 'translateY(0)'};
    color: ${props => props.focused ? theme.color.primary : theme.color.secondary};
    font-size: ${props => props.focused ? '.65em' : 'inherit'};
    transition: color .2s linear, font-size .2s linear, transform .2s linear;
`;

const StyledField = styled.div`
    height: 3em;
    display: flex;
    align-items: flex-end;
    position: relative;
    border-bottom: 1px solid ${theme.color.secondary};
    font-size: inherit;
    
    &:before,
    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        border-bottom: 2px solid ${theme.color.primary};
        width: 50%;
        transform: ${props => props.focused ? 'scaleX(1)' : 'scaleX(0)'};
        transition: transform .2s linear;
    }
    
    &:before {
        transform-origin: right center;
        left: 0;
    }
    
    &:after {
        transform-origin: left center;
        left: 50%;
    }
`;

export const Field = styled(class extends React.Component {

    constructor(props) {
        super(props);

        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        this.state = {
            focused: false,
        };
    }

    handleFocus() {
        this.setState({ focused: true });
    }

    handleBlur() {
        this.setState({ focused: false });
    }

    render() {
        const { className, placeholder, ...inputProps } = this.props;
        const { focused } = this.state;

        return (
            <StyledField focused={focused} className={className}>
                {placeholder && <Placeholder focused={focused}>{placeholder}</Placeholder>}
                <Input {...inputProps} onFocus={this.handleFocus} onBlur={this.handleBlur}/>
            </StyledField>
        );
    }

})``;