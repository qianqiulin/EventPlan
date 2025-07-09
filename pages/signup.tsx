import React from "react"; 
import {useState} from "react";
import {useRouter} from "next/router";
import { enqueueSnackbar, EnqueueSnackbar } from "notistack";

function SignUp() {

    const router = useRouter(); 
    

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: ""
        // userData will have the above 3 properties
    });

    // then in the setUserData function, we can use onChange to dynamically update the state. 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
    
        if (response.ok) {
         
         enqueueSnackbar("Sign-up successful!", { variant: "success" });
          
          //alert("Sign-up successful!");
            router.push("/signin"); // Redirect to sign-in page after successful sign-up

        } else {
          alert("Error signing up.");
          
        }
      };



    
    
    return(
        <div className="signup-page">
            <h1>Sign Up</h1>
            <form onSubmit = {handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value = {userData.username} onChange = {handleChange} />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value = {userData.email} onChange = {handleChange}/>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value = {userData.password} onChange = {handleChange} />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}

// then it should be linked to a text/json file that stores the username and password information. 
// implement a useState 

export default SignUp; 