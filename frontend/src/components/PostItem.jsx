import React from "react";
import { NavLink } from "react-router-dom";

export default function ProjectItem({ post }) {  // Destructure post directly
  // Optional safety: in case post is missing
  if (!post) return null;

  return (
    <NavLink className='post_item' to={`/blog/${post.date}/${post.handle}`}>
      <span className='name'>{post.name}</span>
      <span className='date'>{post.date}</span>
    </NavLink>
  );
}