import React from "react";

export default function Header() {
  return (
    <header>
      <nav>
        <a href="/">Home</a>
        <a className="active" href="/resume.html">
          Resume
        </a>
        <a href="/projects.html">Projects</a>
      </nav>
    </header>
  );
}
