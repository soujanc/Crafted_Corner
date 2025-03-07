import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useReducer,
} from "react";
import { authReducer, userAuthActions } from "../Reducers/AuthReducer";

/**
 * Context for user authentication state.
 * @type {React.Context}
 */

const AuthContext = createContext();

/**
 * Provider component for user authentication.
 *
 * This component fetches the current user or generates a guest ID
 * and provides authentication state to its children.
 *
 * @param {Object} props - The props for the provider.
 * @param {React.ReactNode} props.children - The child components that will have access to the authentication context.
 * @returns {JSX.Element} The provider component.
 */
export const UserAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [guestId, setGuestId] = useState(null);
  const [Authstate, Authdispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
  const { fetchCurrentUser } = userAuthActions(Authdispatch);
  /**
   * Asynchronously loads the current user or generates a guest ID.
   *
   * This function checks if a user is authenticated by calling the
   * `fetchCurrentUser` function. If a user is found, it sets the
   * current user state. If no user is found, it checks localStorage
   * for an existing guest ID. If no guest ID exists, it generates
   * a new guest ID, stores it in localStorage, and updates the
   * guest ID state.
   *
   * This effect runs once when the component mounts.
   */
  useEffect(() => {
    const loadCurrentUser = async () => {
      const response = await fetchCurrentUser();
      if (response?.user) {
        setCurrentUser(response.user);
        console.log("Fetched Current User:", response.user);
        console.log("this is Authstate.user:", Authstate.user);
        console.log("this is Authstate.user:", Authstate.isAuthenticated);
      } else {
        console.log("this is Authstate.user:", Authstate.user);
        console.log("this is Authstate.user:", Authstate.isAuthenticated);
        // Check localStorage for an existing guestId
        let storedGuestId = localStorage.getItem("guestId");

        if (!storedGuestId) {
          // Generate and store guestId only if it doesn't exist
          storedGuestId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          localStorage.setItem("guestId", storedGuestId);
        }

        setGuestId(storedGuestId);
        console.log("Using Guest ID:", storedGuestId);
      }
    };

    loadCurrentUser();
  }, [Authstate.isAuthenticated]);

  return (
    <AuthContext.Provider value={{fetchCurrentUser, currentUser, guestId, Authstate }}>
      {children}
    </AuthContext.Provider>
  );
};
/**
 * Custom hook to use the authentication context.
 *
 * @returns {Object} The current user, guest ID, and authentication state.
 */
export const useAuthUser = () => {
  return useContext(AuthContext);
};
