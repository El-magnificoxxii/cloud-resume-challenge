import { useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import Header from "comps/Header";
import 'css/default.css'
import 'css/pygments.css'


export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    let pageName = "home";

    if (location.pathname === "/") {
      pageName = "home";
    } else if (location.pathname === "/resume") {
      pageName = "resume";
    } else if (location.pathname === "/projects") {
      pageName = "projects";
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

