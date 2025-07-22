import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabase"; // Adjust the path to your Supabase client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { id } = req.query; // Get the friendship ID from the URL
    const { status } = req.body; // Get the new status from the request body

    if (!id || !status) {
      return res.status(400).json({ message: "Friendship ID and status are required." });
    }

    try {
      // Update the status of the friendship record
      const { data, error } = await supabase
        .from("friendship")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error("Error updating friendship status:", error);
        return res.status(500).json({ message: "Error updating friendship status.", error });
      }

      return res.status(200).json({ message: "Friendship status updated successfully.", data });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Internal server error.", error });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}