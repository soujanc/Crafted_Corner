import React from "react";
import { useAuthUser } from "../Context/AuthContext";

export default function ExampleCompnent() {
  const { currentUser, guestId, Authstate } = useAuthUser();
  
  return (
    <div>
      {Authstate.user?.user ? (
        <>
          <h1>Welcome, {Authstate.user.user._id}!</h1>
        </>
      ) : (
        <h1>Welcome, Guest {guestId}!</h1>
      )}
    </div>
  );
}
