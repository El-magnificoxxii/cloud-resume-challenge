import { useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import Header from "comps/Header";
import 'css/default.css'
import 'css/pygments.css'
import 'css/markdown.css'


export default function Layout() {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    let pageName = "home";

    if (path === "/") {
      pageName = "home";
    } else if (path === "/resume") {
      pageName = "resume";
    } else if (path === "/projects") {
      pageName = "projects";
    } else if (/^\/projects\/[^/]+$/.test(path)) {
      // Matches /projects/:handle
      pageName = "project";
    } else if (/^\/blog\/\d{4}-\d{2}-\d{2}\/[^/]+$/.test(path)) {
      // Matches /blog/YYYY-MM-DD/:handle
      pageName = "blog_post";
    }


    document.body.setAttribute("location", pageName);

    // cleanup
    return () => {
      document.body.removeAttribute("location");
    };
  }, [location]);

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

