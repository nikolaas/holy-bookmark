import React from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Link } from '../components/Link';

const LoginSuggestion = styled.div``;

const RegisterForm = styled.form`
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
    
    ${LoginSuggestion} {
        margin-top: 2rem;
    }
`;

export const Register = () => {
    return (
        <Page>
            <RegisterForm>
                <Input type="text" name="firstName" placeholder="First Name"/>
                <Input type="text" name="lastName" placeholder="Last Name"/>
                <Input type="text" name="username" placeholder="Username"/>
                <Input type="password" name="password" placeholder="Password"/>
                <Input type="password" name="confirmPassword" placeholder="Confirm password"/>
                <Button>Register</Button>
                <LoginSuggestion>
                    Do you already have an account? <Link to="/login">Log in</Link>.
                </LoginSuggestion>
            </RegisterForm>
        </Page>
    );
};
