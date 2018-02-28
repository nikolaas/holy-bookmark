import React from 'react';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';

function getOpacityState(state) {
    switch(state) {
        case 'entering': return 0;
        case 'entered': return 1;
        case 'exiting': return 1;
        case 'exited': return 0;
        default: return 0;
    }
}

function getDisplayState(base, state) {
    switch(state) {
        case 'entering': return base;
        case 'entered': return base;
        case 'exiting': return 'none';
        case 'exited': return 'none';
        default: return 'none';
    }
}

function getDisplayAnimationFunc(state) {
    switch(state) {
        case 'entering': return 'step-start';
        case 'entered': return 'step-start';
        case 'exiting': return 'step-start';
        case 'exited': return 'step-start';
        default: return 'step-start';
    }
}

const FadeEffect = styled.div`
    width: 100%;
    flex: 1 1 0%;
    display: ${props => getDisplayState('flex', props.state)};
    align-items: stretch;
    transition: opacity ${props => props.duration}ms ease-in-out, 
                display ${props => props.duration}ms ${props => getDisplayAnimationFunc(props.state)};
    opacity: ${props => getOpacityState(props.state)};
`;

const FadeEffectRenderer = props => state => <FadeEffect {...props} state={state}/>;

export const Fade = ({ timeout, in: inProp, ...props }) => {
    return (
        <Transition in={inProp} timeout={timeout}>
            {FadeEffectRenderer(props)}
        </Transition>
    );
};
