import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { requester_id, requestee_id } = req.body;

    if (!requester_id || !requestee_id) {
      return res.status(400).json({ message: "Both requester_id and requestee_id are required." });
    }

    const { data, error } = await supabase
      .from("friendships")
      .insert([{ requester_id, requestee_id, status: "pending" }]);

    if (error) {
      console.error("Error sending friend request:", error);
      return res.status(500).json({ message: "Failed to send friend request." });
    }

    return res.status(200).json({ message: "Friend request sent.", data });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}