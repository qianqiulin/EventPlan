import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { supabase } from "../../lib/supabase"; // Import Supabase client
 // Load environment variables from .env file
import jwt from "jsonwebtoken"; // Import JSON Web Token library

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { password, email } = req.body; // Extract email and password from request body

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    try {
      // Retrieve user data from the database using Supabase
      const { data: user, error } = await supabase
        .from("usersVig") 
        .select("id, email, password, role")
        .eq("email", email)
        .limit(1)
        .single();

      // Handle errors or missing user
      if (error || !user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password as string, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role }, // Payload
        process.env.JWT_SECRET!, // Secret key
        { expiresIn: "1h" } // Token expiration
      );

      // Set the token in an HTTP-only cookie
      res.setHeader(
        "Set-Cookie",
        `token=${token}; HttpOnly; Path=/; Max-Age=14400; SameSite=Strict`
      );
      console.log("Cookie set:", `token=${token}`); // Debugging: Log the cookie

      // Respond with success message
      return res.status(200).json({
        message: "Sign-in successful",
        token, // Optional: Include token in response for debugging purposes
      });
    } catch (error) {
      console.error("Error during sign-in:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
