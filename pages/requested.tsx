import React, { useState, useEffect } from "react";
import {useAuth} from "../lib/AuthContext"; // Custom hook for authentication context
import { useRouter } from "next/router";
import { enqueueSnackbar, EnqueueSnackbar } from "notistack";



export interface Friendship {
  id: number;
  requester_id: number;
  requestee_id: number;
  status: string;
  requester: {
    username: string; 
  }
  }


interface User {
   id: number; 
}

function PendingFriendRequests({ requesteeId }: { requesteeId: number }) {

  const router = useRouter();
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  
  
  const [loadingFriendships, setLoadingFriendships] = useState(true);

  const { user, isAuthenticated, loading } = useAuth(); // Use the custom authentication hook

  useEffect(() => {
      if (!isAuthenticated && !loading) {
        router.push("/signin"); // Redirect to sign-in page if not authenticated
      }
    }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const fetchFriendships = async () => {

      if (!user?.id) {
        console.error("User ID is not available.");
        return;
      }
      try {
        requesteeId = user?.id
        const response = await fetch(`/api/requested?requesteeId=${requesteeId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch friendships.");
        }
        const data = await response.json();
        setFriendships(data.friendships);
        
      } catch (error) {
        console.error("Error fetching friendships:", error);
      } finally {
        setLoadingFriendships(false)
   
      }
    };

    fetchFriendships();
  }, [user?.id]);

  const handleAcceptRequest = async (id: number) => {
    try {
      const response = await fetch(`/api/friendships/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept the request.");
      }

      enqueueSnackbar("Friend request accepted successfully!", {
        variant: "success",
      }); 

      // Update the UI by removing the accepted request
      setFriendships((prev) => prev.filter((friendship) => friendship.id !== id));
      
    } catch (error) {
      console.error("Error accepting the request:", error);
    }
  };

  if (loading) {
    return <p>Loading pending friend requests...</p>;
  }

  if (friendships.length === 0) {
    return <p>No pending friend requests found.</p>;
  }

  return (
    <div>
      <h2>Pending Friend Requests</h2>
      <ul>
        {friendships.map((friendship) => (
          <li key={friendship.id}>
            Requests: {friendship.requester.username}, Status: {friendship.status}
            <button onClick={()=>handleAcceptRequest(friendship.id)}> Accept </button>
            <button>Reject</button>
            {/* You can add functionality to accept or reject requests here */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PendingFriendRequests;