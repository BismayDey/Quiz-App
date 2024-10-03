import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  Snackbar,
  Grid,
} from "@mui/material";
import axios from "axios";
import axiosRetry from "axios-retry";
import { motion } from "framer-motion";
import useSound from "use-sound";
import correctSound from "../sounds/correct.mp3";
import incorrectSound from "../sounds/incorrect.mp3";
import tickingSound from "../sounds/ticking.mp3";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

axiosRetry(axios, {
  retries: 3,
  retryCondition: (error) => error.response && error.response.status === 429,
  retryDelay: (retryCount) => retryCount * 2000,
});

const fetchQuestions = async (category, difficulty, amount) => {
  const cacheKey = `questions_${category}_${difficulty}_${amount}`;
  const cachedQuestions = localStorage.getItem(cacheKey);

  if (cachedQuestions) {
    return JSON.parse(cachedQuestions);
  } else {
    const response = await axios.get(
      `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
    );
    localStorage.setItem(cacheKey, JSON.stringify(response.data.results));
    return response.data.results;
  }
};

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [leaderboard, setLeaderboard] = useState(
    () => JSON.parse(localStorage.getItem("leaderboard")) || []
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { username, category, difficulty, questionCount, timerDuration } =
    location.state;

  const [playCorrect] = useSound(correctSound);
  const [playIncorrect] = useSound(incorrectSound);
  const [playTicking, { stop }] = useSound(tickingSound);

  useEffect(() => {
    fetchQuestions(category, difficulty, questionCount)
      .then((data) => setQuestions(data))
      .catch((error) => console.log("Error fetching quiz data:", error));
  }, [category, difficulty, questionCount]);

  useEffect(() => {
    if (timer === 0) {
      handleNext();
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    playTicking();
    return () => {
      clearInterval(interval);
      stop();
    };
  }, [timer]);

  const handleSubmit = () => {
    stop();
    setIsSubmitted(true);

    if (selectedAnswer === questions[currentQuestion]?.correct_answer) {
      setScore((prev) => prev + 1);
      playCorrect();
    } else {
      playIncorrect();
      setCorrectAnswer(questions[currentQuestion]?.correct_answer);
    }

    setOpenSnackbar(true);
  };

  const handleNext = async () => {
    stop();
    setSelectedAnswer("");
    setIsSubmitted(false);
    setCorrectAnswer("");

    if (currentQuestion < questionCount - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimer(timerDuration);
    } else {
      try {
        await addDoc(collection(db, "quizResults"), {
          username,
          score,
          date: new Date().toLocaleString(),
        });
        const newLeaderboard = [
          ...leaderboard,
          { username, score, date: new Date().toLocaleString() },
        ];
        setLeaderboard(newLeaderboard);
        localStorage.setItem("leaderboard", JSON.stringify(newLeaderboard));
        navigate("/result", { state: { score } });
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const answers =
    questions.length > 0
      ? [
          ...questions[currentQuestion].incorrect_answers,
          questions[currentQuestion].correct_answer,
        ]
      : [];

  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    setShuffledAnswers([...answers].sort(() => Math.random() - 0.5));
  }, [currentQuestion, questions]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}
    >
      <Grid
        container
        spacing={2}
        justifyContent="center"
        style={{ marginBottom: "20px" }}
      >
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <FormLabel component="legend">Category</FormLabel>
            <Typography variant="body1">{category}</Typography>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <FormLabel component="legend">Difficulty</FormLabel>
            <Typography variant="body1">{difficulty}</Typography>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <FormLabel component="legend">Number of Questions</FormLabel>
            <Typography variant="body1">{questionCount}</Typography>
          </FormControl>
        </Grid>
      </Grid>

      <Typography
        variant="h5"
        style={{ fontSize: "2rem", marginBottom: "20px" }}
      >
        Score: {score}
      </Typography>
      <Typography
        variant="h6"
        style={{ fontSize: "1.5rem", marginBottom: "20px" }}
      >
        Time Left: {timer} seconds
      </Typography>
      {questions.length > 0 ? (
        <>
          <FormControl component="fieldset" style={{ marginBottom: "20px" }}>
            <FormLabel
              component="legend"
              style={{ fontSize: "2rem", marginBottom: "20px" }}
            >
              {questions[currentQuestion]?.question}
            </FormLabel>
            <RadioGroup
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {shuffledAnswers.map((answer, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    marginBottom: "10px",
                    width: "80%",
                    borderRadius: "8px",
                    border:
                      selectedAnswer === answer
                        ? "2px solid red"
                        : "2px solid #ccc",
                    backgroundColor: isSubmitted
                      ? answer === questions[currentQuestion]?.correct_answer
                        ? "lightgreen"
                        : answer === selectedAnswer
                        ? "lightcoral"
                        : "#fff"
                      : "#fff",
                    transition: "background-color 0.3s, border 0.3s",
                  }}
                >
                  <FormControlLabel
                    value={answer}
                    control={<Radio />}
                    label={answer}
                    style={{ fontSize: "1.5rem" }}
                  />
                </motion.div>
              ))}
            </RadioGroup>
          </FormControl>
          <Grid container justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={selectedAnswer === "" || isSubmitted}
              style={{
                marginBottom: "10px",
                width: "60%",
                padding: "10px",
                fontSize: "1rem",
              }}
            >
              Submit Answer
            </Button>
          </Grid>
          {isSubmitted && (
            <div>
              <Typography variant="body1" style={{ fontSize: "1.5rem" }}>
                {selectedAnswer === questions[currentQuestion]?.correct_answer
                  ? "Correct!"
                  : `Wrong! The correct answer was: ${questions[currentQuestion]?.correct_answer}`}
              </Typography>
              <Grid container justifyContent="center">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  style={{
                    marginTop: "10px",
                    width: "60%",
                    padding: "10px",
                    fontSize: "1rem",
                  }}
                >
                  Next Question
                </Button>
              </Grid>
            </div>
          )}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            message={
              selectedAnswer === questions[currentQuestion]?.correct_answer
                ? "Correct!"
                : `Wrong! The correct answer was: ${questions[currentQuestion]?.correct_answer}`
            }
          />
        </>
      ) : (
        <Typography variant="h5" style={{ marginTop: "20px" }}>
          Loading questions...
        </Typography>
      )}
    </motion.div>
  );
};

export default Quiz;
