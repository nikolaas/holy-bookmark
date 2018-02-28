import React from 'react';
import { Page } from '../components/Page';
import { Link } from '../components/Link';

export const Main = () => {
    // const user = {
    //     email: '',
    //     firstName: '',
    //     secondName: '',
    // };
    const user = null;

    return (
        <Page>
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
        </Page>
    );
};