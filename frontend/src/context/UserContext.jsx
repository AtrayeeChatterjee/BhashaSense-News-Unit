import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: null, // We will store the MongoDB _id here
    name: "",
    occupation: "",
    location: "",
    goals: "",
    preferredLanguage: "Hindi",
    likedTopics: [],
    isSetupComplete: false,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);