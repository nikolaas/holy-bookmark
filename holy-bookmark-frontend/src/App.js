import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatedPageRenderer } from './components/AnimatedPageRenderer';
import { AnimatedPage } from './components/AnimatedPage';
import { Routes } from './routes';
import './App.css';

const App = () => {
    return (
        <BrowserRouter>
            <AnimatedPageRenderer animationEffect={AnimatedPage} timeout={0} duration={300}>
                <Routes/>
            </AnimatedPageRenderer>
        </BrowserRouter>
    );
};

export default App;
