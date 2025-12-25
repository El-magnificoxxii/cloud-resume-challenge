import React from "react";

export default function ResumeSection({ title, className, children }) {
  return (
    <section className={className}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
