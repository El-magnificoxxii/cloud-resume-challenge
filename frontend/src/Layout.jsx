import { useState } from 'react'
import Header from 'comps/Header'
import ResumePage from 'pages/ResumePage'
import { Outlet } from 'react-router'



export default function Layout() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
       <div className="content_wrap">
          <article>
            <div className="content">
              <Outlet />
            </div>
          </article>
        </div>
    </>
  )
}

