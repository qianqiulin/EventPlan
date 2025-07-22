import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Fetch all users from the "users" table
      const { data: users, error } = await supabase.from("usersVig").select("id, username, email");

      if (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Failed to fetch users." });
      }

      return res.status(200).json(users);
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "An unexpected error occurred." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}