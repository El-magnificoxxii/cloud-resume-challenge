import React from "react";

export default function ResumeHeader(props) {
  const person = props.person;
  return (
    <section className="header">
        <h1>{person.name}</h1>
        <p>
            
          <span className="email"><a href="mailto:abdullateefoni@yahoo.com">{person.email}</a></span>
          <span className="bull">&bull;</span>
          <span className="phone">{person.phone}</span>
          <span className="bull">&bull;</span>
          <span className="website">{person.website}</span>
           
        </p>
    </section>
  );
}
