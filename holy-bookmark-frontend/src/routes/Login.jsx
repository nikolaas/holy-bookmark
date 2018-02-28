import React from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Link } from '../components/Link';

const CreateAccountSuggestion = styled.div``;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 1 0;
    max-width: 30rem;
    
    ${Input},
    ${Button} {
        width: 100%;    
    }
    
    ${Input} {
        margin-top: 1rem;
        &:first-child {
            margin-top: 0;
        }
    }
    
    ${Button} {
        margin-top: 3rem;
    }
    
    ${CreateAccountSuggestion} {
        margin-top: 2rem;
    }
`;

export const Login = () => {
    return (
        <Page>
            <LoginForm>
                <Input type="text" name="username" placeholder="Username"/>
                <Input type="password" name="password" placeholder="Password"/>
                <Button>Log in</Button>
                <CreateAccountSuggestion>
                    or <Link to="/register">create account</Link> if not exist
                </CreateAccountSuggestion>
            </LoginForm>
        </Page>
    );
};
