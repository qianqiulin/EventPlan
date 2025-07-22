import React, { useState, useEffect } from "react";

import { useAuth } from "../lib/AuthContext"; // Custom hook for authentication context
import { useRouter } from "next/router"; // Use Next.js router for navigation
import { enqueueSnackbar, EnqueueSnackbar } from "notistack";

interface User {
  id: number;
  username: string;
  email: string;
}

function SearchUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const router = useRouter();

  const { isAuthenticated, loading, user } = useAuth(); // Use the custom authentication hook

  console.log("This is the isAuthenticated value: " + isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/signin"); // Redirect to sign-in page if not authenticated
    }
  }, [loading, isAuthenticated, router]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const sendFriendRequest = async (requesteeId: number) => {
    try {
      const response = await fetch("/api/friendships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requesterId: user?.id, // Use the authenticated user's ID
          requesteeId, // ID of the user receiving the request
          // Initial status of the friendship request
        }),
      });

      if (response.ok) {
        enqueueSnackbar("Friendship request sent successfully.", {
          variant: "success",
        });
        console.log("Friendship request sent successfully.");
      } else {
        console.error("Failed to send friendship request.");
        enqueueSnackbar("Friend request has already been sent", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Error sending friendship request.", {
        variant: "error",
      });
      console.error("Error sending friendship request:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().startsWith(search.toLowerCase()) // Access email for each user
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={handleSearch}
      />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>
            {user.username} ({user.email})
            <button onClick={() => sendFriendRequest(user.id)}>Add Friend</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchUsers;