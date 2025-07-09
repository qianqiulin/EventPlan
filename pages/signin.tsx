import React, { useState } from "react";
import { useAuth } from "../lib/AuthContext"; 
import { useRouter } from "next/router";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {checkAuthentication} = useAuth();
  // see if it will be used
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
      
          const response = await fetch("/api/signin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",


            },
            body: JSON.stringify({ email, password }),
           
          });
      
          if (response.ok) {
             await checkAuthentication(); // Check authentication status after sign-in
            alert("Sign-in successful!");
              router.push("/dashboard"); // Redirect to sign-in page after successful sign-up
  
          } else {
            alert("Error signing in");
            router.push("/signin")
            
          }
        };

  return (
    <div>
      <h1>Sign In</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Sign In</button>
    </div>
  );
}

export default SignIn;