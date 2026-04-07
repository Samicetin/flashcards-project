import React, { useState, useEffect } from "react";
import Auth from "../components/Auth";
import { Outlet, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ROUTES from "./routes";
import { selectHasResults } from "../features/results/resultsSlice";
import { addTopic } from "../features/topics/topicsSlice";
import { addQuiz } from "../features/quizzes/quizzesSlice";
import { addCard } from "../features/cards/cardsSlice";
import { getAllTopicsFromFirestore } from "../features/topics/firestoreTopics";
import { getAllQuizzesFromFirestore } from "../features/quizzes/firestoreQuizzes";
import { getAllCardsFromFirestore } from "../features/cards/firestoreCards";
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


export default function AppLayout() {
    const hasResults = useSelector(selectHasResults);
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dispatch = useDispatch();

    // Restore auth state and load all Firestore data once authenticated
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                return;
            }
            // Restore user profile from Firestore
            const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
            const profile = userSnap.exists() ? userSnap.data() : {};
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...profile });

            // Load all data now that the user is authenticated
            const [topicsFromDb, quizzesFromDb, cardsFromDb] = await Promise.all([
                getAllTopicsFromFirestore(),
                getAllQuizzesFromFirestore(),
                getAllCardsFromFirestore(),
            ]);
            Object.values(topicsFromDb).forEach((topic) => dispatch(addTopic(topic)));
            Object.values(quizzesFromDb).forEach((quiz) => dispatch(addQuiz(quiz)));
            Object.values(cardsFromDb).forEach((card) => dispatch(addCard(card)));
        });
        return () => unsubscribe();
    }, [dispatch]);

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="app-shell">
            <button
                type="button"
                className="menu-toggle"
                aria-label="Open navigation menu"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
                <span />
                <span />
                <span />
            </button>

            {isSidebarOpen && <button className="sidebar-overlay" onClick={closeSidebar} aria-label="Close navigation menu" />}

            <nav className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <h2 className="nav-heading">Adelaide Quizzes</h2>
                <ul>
                    <li>
                        <NavLink to={ROUTES.topicsRoute()} onClick={closeSidebar}>
                            Topics
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={ROUTES.quizzesRoute()} onClick={closeSidebar}>
                            Quizzes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={ROUTES.newQuizRoute()} onClick={closeSidebar}>
                            New Quiz
                        </NavLink>
                    </li>
                    {hasResults && (
                        <li>
                            <NavLink to={ROUTES.resultsRoute()} onClick={closeSidebar}>
                                Results
                            </NavLink>
                        </li>
                    )}
                </ul>
                <div className="auth-panel">
                    {user ? (
                        <span>Signed in as: {user.username || user.email}</span>
                    ) : (
                        <Auth onAuth={setUser} />
                    )}
                </div>
            </nav>

            <main className="app-content">
                <Outlet context={{ user }} />
            </main>
        </div>
    );
}
