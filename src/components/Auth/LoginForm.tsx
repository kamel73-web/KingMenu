// Import necessary dependencies
import React from 'react';
import { Redirect } from 'react-router-dom';

const LoginForm = () => {
    // Logic for handling OAuth and redirecting
    const redirectTo = "/#/login"; // Updated URL for redirect

    // other code...

    return (<Redirect to={redirectTo} />);
};

export default LoginForm;