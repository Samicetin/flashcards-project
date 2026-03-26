import React, { useState } from "react";
import { auth, provider, db } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Auth({ onAuth }) {
  const [username, setUsername] = useState("");
  const [showUsername, setShowUsername] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Check if user already has a username
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().username) {
        onAuth({ ...userSnap.data(), uid: user.uid });
      } else {
        setShowUsername(true);
      }
    } catch (err) {
      setError("Google sign-in failed");
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!username) return setError("Username required");
    // Save username to Firestore
    const user = auth.currentUser;
    if (!user) return setError("Not signed in");
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { username, email: user.email }, { merge: true });
    onAuth({ username, email: user.email, uid: user.uid });
  };

  return (
    <div style={{ margin: 20 }}>
      {!showUsername ? (
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      ) : (
        <form onSubmit={handleUsernameSubmit}>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />
          <button type="submit">Save Username</button>
        </form>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
