import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";
import {Friendship} from "../requested"; // Adjust the import path as necessary

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    
  if (req.method === "GET") {
    const { requesteeId } = req.query; // requesteeId from the query parameters

    if (!requesteeId) {
      return res.status(400).json({ message: "Requestee ID is required." });
      // client side error(improper request)
    }

    try {
      // Fetch friendship records where the requestee_id matches and status is "pending"
      const { data: friendships, error } = await supabase
      .from("friendship")
      .select(`
        id,
        requester_id,
        requestee_id,
        status,
        requester: usersVig!requester_id (username)
        
      `) // Join with the users table using the foreign key
      .eq("requestee_id", requesteeId)
      .eq("status", "pending"); // Filter by status "pending"


      if (error) {
        console.error("Error fetching friendships:", error);
        return res.status(500).json({ message: "Error fetching friendships." });
      }

      return res.status(200).json({ friendships });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Internal server erro==." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}