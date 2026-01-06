import React from "react";
import 'css/pages/home.css'
import abdullateef_oni from 'images/abdullateef-oni-thumb.webp'
import blogData from 'data/blogData.json'
import linksData from 'data/linksData.json'
import PostItem from "comps/PostItem"

export default function HomePage() {
  const sortedBlogData = [...blogData].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <>
        <h1 className='fancy'>Abdullateef Oni's Blog</h1>
        <div className="intro_video">
          <img src={abdullateef_oni} />
        </div>
        <div className='links'>
          {linksData.map((link) => (
            <a target="_blank" href={link.url}>
              <span className="icon" dangerouslySetInnerHTML={{ __html: link.icon }} />
              <span className="name">{link.name}</span>
            </a>
          ))}  
        </div>
        <section className='posts'>
          <h2>Recent Posts</h2>
          {sortedBlogData.map((post) => (
            <PostItem key={post.handle} post={post} />
          ))}
        </section>
    </>
  )
}