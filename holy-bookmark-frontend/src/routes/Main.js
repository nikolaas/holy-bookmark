import React from 'react';
import styled from "styled-components";
import { Link } from '../components/Link';

const GreetingContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem 0;
`;

export const Main = () => {
    // const user = {
    //     email: '',
    //     firstName: '',
    //     secondName: '',
    // };
    const user = null;

    return (
        <GreetingContainer>
            {
                user &&
                <div>
                    <Link to="/profile">Get Started</Link>
                </div>
            }
            {
                !user &&
                <div>
                    <Link to="/login">Log in</Link> or <Link invert to="/register">Register</Link>
                </div>
            }
        </GreetingContainer>
    );
};