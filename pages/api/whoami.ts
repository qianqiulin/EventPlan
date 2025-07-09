import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Cookies:", req.cookies); // Debugging: Log all cookies
    const token = req.cookies.token;

    if (!token) {
      console.log("Token is missing"); // Debugging: Log missing token
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Decode the token without verification
    const decodedWithoutVerification = jwt.decode(token);
    console.log("Decoded token (without verification):", decodedWithoutVerification);

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("Verified token:", decoded); // Debugging: Log the verified token

    // Respond with user information
    return res.status(200).json({ user: decoded });
  } catch (error) {
    console.error("Error verifying token:", error); // Debugging: Log the error
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}