import React from "react";
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css"

export default function Home(){
    return (
        <div className="home">
            <h1>Welcome to NITT-INE</h1>
            <Button href="/register">Register</Button>
            <Button href="/login">Login</Button>
            <Button href="/Dashboard">Dashboard</Button>
        </div>
    )
}
