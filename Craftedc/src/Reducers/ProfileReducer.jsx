export const initialProfileState = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  profileImage: {
    preview: "../public/Images/profile.jpg", // Default profile image
    file: null,
  },
};

export const profileReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_PROFILE":
      return {
        ...state,
        ...action.payload, // Ensure this merges the updated fields correctly
      };
    case "SET_PROFILE_IMAGE":
      return {
        ...state,
        profileImage: action.payload, // Update profile image
      };
    case "RESET_PROFILE":
      return {
        ...initialProfileState, // Reset profile to initial state
      };
    case "DELETE_ACCOUNT":
      return {
        profile: initialProfileState, // Clear profile data on account deletion
      };
    default:
      return state; // Return current state if action type is not recognized
  }
};

export default profileReducer;
