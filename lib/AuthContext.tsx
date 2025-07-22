import React, { createContext, useContext, useState, useEffect } from "react";

// if whoami response is ok, then we can go ahead and authenticate the user. n

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  checkAuthentication: () => Promise<void>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean; 
  admin: boolean; 

};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true) // State to track if the user is an admin

 
  // Function to check authentication status that can be used globally. 
  const checkAuthentication = async () => {
    try {
      const response = await fetch("/api/whoami", {
        method: "GET",
        credentials: "include", // Ensures cookies are sent with the request
      });

      if (response.ok) {
        console.log(response)
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data.user); // Set user information globally
        console.error("This is the usere data: "  +  data.user); 
        setAdmin(data.user?.role === "admin"); 
        // NOTE: this is just temp way to check admin status
        // need to figure out how to access database for the role. 

       
        
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false)
    }


  };

  useEffect(() => {
    // Check authentication status when the component mounts
    checkAuthentication();
  }, []); // Empty dependency array ensures this runs only once when the component mounts


  // Automatically check authentication when the app loads
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, admin, checkAuthentication, setIsAuthenticated, setAdmin, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};