"use client";
import React from "react";
import { Inter } from "next/font/google";
import { MyProvider } from "@/context/appContext";
import { usePathname } from "next/navigation";
import "./globals.css";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname); // Access pathname
  }, []);

  return (
    <MyProvider>
      <html lang="en">
        <head>
          <title>Waste Management</title>
        </head>
        <body className={inter.className}>
          {pathname === "/login" ? (
            <React.Fragment>{children}</React.Fragment>
          ) : (
            <div className="row mx-0">
              <nav
                id="sidebarMenu"
                className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse"
              >
                <div className="sidebar-sticky pt-3">
                  <li className="nav-item">
                    <a className="navbar-brand text-light" href="/">
                      Waste Mgt. Sys.
                    </a>
                  </li>
                  <ul className="nav flex-column mt-4">
                    <li className="nav-item">
                      <a
                        href="/"
                        className="nav-link text-white active"
                        aria-current="page"
                      >
                        Home
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="/addBins" className="nav-link text-white">
                        Add Bins
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="/reviewRequest" className="nav-link text-white">
                        Review Requests
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="/viewRecords" className="nav-link text-white">
                        View Records
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="/viewBins" className="nav-link text-white">
                        View Bins
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="addCommunityMem" className="nav-link text-white">
                        Add Members
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="complainFeedbacks"
                        className="nav-link text-white"
                      >
                        Complains / Feedbacks
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
              <main className="col-md-9 ms-sm-auto col-lg-10 px-0">
                {children}
              </main>
            </div>
          )}

          <script
            src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
            integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
            crossOrigin="anonymous"
          ></script>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
            integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
            crossOrigin="anonymous"
          ></script>
        </body>
      </html>
    </MyProvider>
  );
}
