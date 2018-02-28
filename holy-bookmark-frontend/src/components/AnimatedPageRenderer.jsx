import React from 'react';
import { Route } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';

export const AnimatedPageRenderer = ({animationEffect: AnimationEffect, ...props}) => {
    return (
        <Route render={({ location }) => (
            <TransitionGroup component={({ children }) => children}>
                <AnimationEffect {...props} key={location.pathname}/>
            </TransitionGroup>
        )}/>
    );
};
