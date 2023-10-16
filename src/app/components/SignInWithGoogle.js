"use client"
import React from 'react';

const SignInWithGoogle = ({children}) => {
    const handleSignInWithGoogle = () => {
        window.location.href = '/auth/google';
        // window.location.href = 'http://localhost:8080/auth/google';
    };

    return (
        <button onClick={handleSignInWithGoogle} style={{margin: "25px 0px 25px 0px"}}>{children}</button>
    );
};

export default SignInWithGoogle;
