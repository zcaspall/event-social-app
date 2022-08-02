import React from 'react';
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div id="navigation">
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/calendar">Calendar</Link>
            </li>
            <li>
                <Link to="/projects">Projects</Link>
            </li>
            <li>
                <Link to="/account">Account</Link>
            </li>
            <li>
                <Link to="/notifications">Notifications</Link>
            </li>
        </div>
    );
}