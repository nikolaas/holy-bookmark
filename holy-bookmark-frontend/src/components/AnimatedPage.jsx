import React from 'react';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';
import { withRouter, matchPath } from 'react-router';
import { Header } from '../components/Header';
import theme from "../theme";

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

const Page = styled.div`
    min-height: 100%;
    height: 1px ;
    display: ${props => getDisplayState('block', props.state)};
    font-family: ${theme.font.family};
`;

const PageHeader = styled(Header)``;

const PageContent = styled.div`
    flex: 1 1 0;
    display: ${props => getDisplayState('block', props.state)};
    align-items: stretch;
    transition: opacity ${props => props.duration}ms ease-in-out, 
                display ${props => props.duration}ms step-start;
    opacity: ${props => getOpacityState(props.state)};
`;

const AnimatedPageRenderer = ({ tiny, children, duration, location }) => state => {
    const tiny = !matchPath(location.pathname, { path: '/', exact: true });
    return (
        <Page state={state}>
            <PageHeader state={state} tiny={tiny}/>
            <PageContent state={state} duration={duration}>
                {children}
            </PageContent>
        </Page>
    );
};

export const AnimatedPage = withRouter(({ timeout, in: inProp, ...pageProps }) => {
    return (
        <Transition in={inProp} timeout={timeout}>
            {AnimatedPageRenderer(pageProps)}
        </Transition>
    );
});
