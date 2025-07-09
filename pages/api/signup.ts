import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase"; // Import your Supabase client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, password, email } = req.body;

    // Validate request body
    if (!username || !password || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users(Vignesh)") // Query the "users(Vignesh)" table
      .select("*")
      .eq("email", email)
      .limit(1);

    if (fetchError) {
      console.error("❌ Supabase fetch error:", fetchError);
      return res.status(500).json({ message: "Error checking for existing user" });
    }

    if (existingUser && existingUser.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user data into the database using Supabase
      const { error: insertError } = await supabase
        .from("users(Vignesh)")
        .insert([
          {
            username,
            email,
            password: hashedPassword,
           
          },
        ]);

      if (insertError) {
        console.error("❌ Supabase insert error:", insertError);
        return res.status(500).json({ message: "Error creating user" });
      }

      // Respond with success message
      res.status(200).json({ message: "User added successfully!" });
    } catch (error) {
      console.error("❌ Error during signup:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
  }
}