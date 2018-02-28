import React from 'react';
import { Page } from '../components/Page';
import { ButtonLink } from '../components/ButtonLink';

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
                    <ButtonLink to="/profile">Get Started</ButtonLink>
                </div>
            }
            {
                !user &&
                <div>
                    <ButtonLink to="/login">Log in</ButtonLink> or <ButtonLink invert to="/register">Register</ButtonLink>
                </div>
            }
        </Page>
    );
};