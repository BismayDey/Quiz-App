// components/Result.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score } = location.state;

  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  // Sort leaderboard by score in descending order
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);

  // Define styles directly in the component
  const styles = {
    container: {
      padding: "20px",
      borderRadius: "15px",
      backgroundColor: "#f5f5f5",
      maxWidth: "600px",
      margin: "auto",
      marginTop: "50px",
    },
    score: {
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#3f51b5",
    },
    header: {
      color: "#1e88e5",
      marginBottom: "20px",
    },
    button: {
      marginTop: "20px",
      padding: "10px 20px",
      fontSize: "1.2rem",
      borderRadius: "20px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#1e88e5",
      color: "white",
    },
    listItem: {
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      marginBottom: "10px",
      padding: "15px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      position: "relative",
    },
    scoreText: {
      fontWeight: "bold",
      color: "#ff5722", // Orange color for scores
      fontSize: "1.2rem",
    },
    dateText: {
      color: "#888",
      fontSize: "0.9rem",
      position: "absolute",
      bottom: "10px",
      right: "15px",
    },
    userText: {
      fontWeight: "bold",
      color: "#3f51b5", // Primary color for usernames
    },
  };

  return (
    <Paper elevation={3} style={styles.container}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ textAlign: "center" }}
      >
        <Typography variant="h4" style={styles.score}>
          Your Score: {score}
        </Typography>
        <Typography variant="h5" style={styles.header}>
          Leaderboard
        </Typography>
        <List>
          {sortedLeaderboard.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ListItem style={styles.listItem}>
                <Grid container justifyContent="space-between">
                  <Grid item xs={8}>
                    <ListItemText
                      primary={
                        <span style={styles.userText}>
                          User: {entry.username}
                        </span>
                      }
                      secondary={
                        <span style={styles.scoreText}>
                          Score: {entry.score}
                        </span>
                      }
                    />
                  </Grid>
                  <Grid item xs={4} style={{ textAlign: "right" }}>
                    <Typography style={styles.dateText}>
                      {entry.date}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            </motion.div>
          ))}
        </List>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            style={styles.button}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor =
                styles.buttonHover.backgroundColor;
              e.target.style.color = styles.buttonHover.color;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "";
              e.target.style.color = "";
            }}
          >
            Play Again
          </Button>
        </motion.div>
      </motion.div>
    </Paper>
  );
};

export default Result;
