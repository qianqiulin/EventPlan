import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase"; // Adjust the import based on your setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { requesterId, requesteeId } = req.body;

    try {

      const {data: checkData, error: checkError} = await supabase
          .from("friendship")
          .select("*")
          .eq("requester_id", requesterId)
          .eq("requestee_id", requesteeId)
          

        if(checkError) {
          return res.status(500).json({ message: "Error checking existing friendship." });
        }

        if(checkData.length > 0) {
          return res.status(409).json({ message: "Friendship request already exists." });
          
        }

      // Insert a new friendship record into the "friendships" table
      const { data, error } = await supabase
        .from("friendship")
        .insert([{ requester_id: requesterId, requestee_id: requesteeId }])
        
        // Limit to one record to avoid duplicates (have to do this )

      if (error) {
        console.error("Error creating friendship:", error);
        return res.status(501).json({ message: "Failed to create friendship." });
      }

      return res.status(201).json({ message: "Friendship request created successfully.", data });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(501).json({ message: "An unexpected error occurred." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}