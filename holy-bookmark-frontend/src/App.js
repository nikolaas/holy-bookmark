import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { Fade } from './components/Fade';
import { Header } from './components/Header';
import { Main } from './routes/Main';
import { Login } from './routes/Login';
import { Register } from './routes/Register';
import { Profile } from './routes/Profile';
import { NotFound } from './routes/NotFound';
import theme from './theme';
import './App.css';

const AppContainer = styled.div`
    min-height: 100%;
    height: 1px ;
    display: flex;
    flex-direction: column;
    font-family: ${theme.font.family};
`;

const AppContent = styled.div`
  flex: 1 1 0;
  display: flex;
  align-items: stretch;
`;

const AnimatedRouteRenderer = ({animationEffect: AnimationEffect, children, ...animationProps}) => {
    return (
        <Route render={({ location }) => (
            <TransitionGroup component={AppContent}>
                <AnimationEffect {...animationProps} key={location.pathname}>
                    {children}
                </AnimationEffect>
            </TransitionGroup>
        )}/>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AppContainer>
                <Header/>
                <AnimatedRouteRenderer animationEffect={Fade} timeout={0} duration={300}>
                    <Switch>
                        <Route exact path="/" component={Main}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        <Route exact path="/profile" component={Profile}/>
                        <Route component={NotFound}/>
                    </Switch>
                </AnimatedRouteRenderer>
            </AppContainer>
        </BrowserRouter>
    );
};

export default App;
