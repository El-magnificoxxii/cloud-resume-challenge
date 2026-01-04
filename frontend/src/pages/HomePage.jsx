import React from "react";
import 'css/pages/home.css'
import abdullateef_oni from 'images/abdullateef-oni-thumb.webp'
import blogData from 'data/blogData.json'
import PostItem from "comps/PostItem"

export default function HomePage() {
  return (
    <>
        <div className="intro_video">
          <img src={abdullateef_oni} />
        </div>

        <section className='posts'>
          <h2>Recent Posts</h2>
          {blogData.map((post) => (
            <PostItem key={post.handle} post={post} />
          ))}
        </section>
    </>
  )
}