import React from "react";

export default function ResumeSectionItem({ item }) {
  return (
    <div className="item">
      {(item.title || item.duration) && (
        <div className="item_heading">
          {item.title && (
            <h3>
              {item.link ? <a href={item.link}>{item.title}</a> : item.title}
            </h3>
          )}
          {item.duration && (
            <div className="duration">{item.duration}</div>
          )}
        </div>
      )}

      {item.subtitle && <div>{item.subtitle}</div>}
      {item.summary && <p>{item.summary}</p>}

      {item.bullets && (
        <ul>
          {item.bullets.map((bullet, i) =>
            typeof bullet === "string" ? (
              <li key={i}>{bullet}</li>
            ) : (
              <li key={i}>
                {bullet.title}
                <ul>
                  {bullet.items.map((sub, j) => (
                    <li key={j}>{sub}</li>
                  ))}
                </ul>
              </li>
            )
          )}
        </ul>
      )}

      {item.values && (
        <ul>
          <li>
            <strong>{item.label}: </strong>
            {item.values.join(", ")}
          </li>
        </ul>
      )}
    </div>
  );
}
