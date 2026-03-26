import React, { useState } from "react";
import Auth from "../components/Auth";
import { Outlet, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ROUTES from "./routes";
import { selectHasResults } from "../features/results/resultsSlice";


export default function AppLayout() {
    const hasResults = useSelector(selectHasResults);
    const [user, setUser] = useState(null);

    return (
        <div>
            <div className="animated-background">
                {Array.from({ length: 100 }, (_, i) => (
                    <span key={i} className="falling-mark" style={{ 
                        left: `${Math.random() * 100}%`, 
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${3 + Math.random() * 5}s`
                    }}>
                        ?
                    </span>
                ))}
            </div>
            <nav>
                <h2 className="nav-heading">Adelaide Quizzes</h2>
                <ul>
                <li>
                    <NavLink to={ROUTES.topicsRoute()} >
                    Topics
                    </NavLink>
                </li>
                <li>
                    <NavLink to={ROUTES.quizzesRoute()} >
                    Quizzes
                    </NavLink>
                </li>
                <li>
                    <NavLink to={ROUTES.newQuizRoute()} >
                    New Quiz
                    </NavLink>
                </li>
                {hasResults && (
                  <li>
                    <NavLink to={ROUTES.resultsRoute()}>
                      Results
                    </NavLink>
                  </li>
                )}
                </ul>
                <div style={{ float: "right" }}>
                  {user ? (
                    <span>Signed in as: {user.username || user.email}</span>
                  ) : (
                    <Auth onAuth={setUser} />
                  )}
                </div>
            </nav>
            <Outlet context={{ user }} />
        </div>
    );
}
