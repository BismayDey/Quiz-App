// components/Leaderboard.js
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Import Firestore
import { collection, getDocs } from "firebase/firestore";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "quizResults"));
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaderboard(results);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Leaderboard
      </Typography>
      {loading ? (
        <CircularProgress /> // Show loading spinner
      ) : (
        <List>
          {leaderboard
            .sort((a, b) => b.score - a.score)
            .map((entry, index) => (
              <ListItem key={entry.id}>
                <ListItemText
                  primary={`${index + 1}. ${entry.username} - Score: ${
                    entry.score
                  }`}
                />
              </ListItem>
            ))}
        </List>
      )}
    </div>
  );
};

export default Leaderboard;
