// components/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";

const categories = [
  { id: 9, name: "General Knowledge" },
  { id: 21, name: "Sports" },
  { id: 23, name: "History" },
  { id: 17, name: "Science" },
  { id: 18, name: "Computer Science" },
  { id: 22, name: "Geography" },
  { id: 11, name: "Entertainment: Books" },
  { id: 12, name: "Entertainment: Film" },
];

const Home = () => {
  const [username, setUsername] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [timerDuration, setTimerDuration] = useState(30);
  const navigate = useNavigate();

  const startQuiz = () => {
    if (username && category && difficulty) {
      navigate("/quiz", {
        state: { username, category, difficulty, questionCount, timerDuration },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "100px",
        width: "100%",
      }}
    >
      <h2>Enter Your Username</h2>
      <TextField
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      />

      <h2>Select Quiz Category</h2>
      <FormControl style={{ width: "300px", marginBottom: "20px" }}>
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl style={{ width: "300px", marginBottom: "20px" }}>
        <InputLabel>Difficulty</InputLabel>
        <Select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
      </FormControl>

      <FormControl style={{ width: "300px", marginBottom: "20px" }}>
        <InputLabel>Number of Questions</InputLabel>
        <Select
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
        >
          {[5, 10, 15, 20].map((count) => (
            <MenuItem key={count} value={count}>
              {count}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl style={{ width: "300px", marginBottom: "20px" }}>
        <InputLabel>Timer Duration (seconds)</InputLabel>
        <Select
          value={timerDuration}
          onChange={(e) => setTimerDuration(e.target.value)}
        >
          {[15, 30, 45, 60].map((time) => (
            <MenuItem key={time} value={time}>
              {time}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={startQuiz}>
        Start Quiz
      </Button>
    </motion.div>
  );
};

export default Home;
