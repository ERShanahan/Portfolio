import React from "react";

export function Footer() {
    return (
        <footer className="bg-black bg-opacity-80 text-gray-400 text-center py-6 border-t border-gray-700">
        <p>eshanaha@stevens.edu | github.com/ERShanahan | linkedin.com/in/eshanaha</p>
        <p>© {new Date().getFullYear()} Ethan Shanahan. All rights reserved.</p>
        </footer>
    );
}