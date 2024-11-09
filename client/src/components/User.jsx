import React from 'react'
import { UserButton } from '@clerk/clerk-react';

function User() {
    return (
        <div>
            <h1>Welcome to My App</h1>
            <UserButton />
        </div>
    );
}

export default User