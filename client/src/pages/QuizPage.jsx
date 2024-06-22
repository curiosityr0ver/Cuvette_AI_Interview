import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Question from "./Question";
import questionsData from "../data/questions";
import submitQuiz from "../api/submitQuiz";
import styles from "./QuizPage.module.css";

function QuizPage() {
	const [questions, setQuestions] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [questionStates, setQuestionStates] = useState([]);
	const [transcripts, setTranscripts] = useState([]);
	const [completed, setCompleted] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

	const navigate = useNavigate();
	const timerRef = useRef(null);

	useEffect(() => {
		// Fetch questions from the data file
		const fetchQuestions = async () => {
			const fetchedQuestions = questionsData;
			setQuestions(fetchedQuestions);
			setQuestionStates(Array(fetchedQuestions.length).fill("unattempted"));
			setTranscripts(Array(fetchedQuestions.length).fill(""));
		};

		fetchQuestions();

		// Start the countdown timer
		timerRef.current = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(timerRef.current);
					setCompleted(true);
					handleQuizCompletion(questions, transcripts);
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		return () => clearInterval(timerRef.current);
	}, []);

	const handleNext = (transcript, skipped) => {
		const newStates = [...questionStates];
		const newTranscripts = [...transcripts];

		if (skipped) {
			newStates[currentQuestion] = "skipped";
		} else {
			newStates[currentQuestion] = "attempted";
			newTranscripts[currentQuestion] = transcript;
		}

		setQuestionStates(newStates);
		setTranscripts(newTranscripts);
		setIsRecording(false);

		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1);
			newStates[currentQuestion + 1] = "current";
		} else {
			setCompleted(true);
			handleQuizCompletion(questions, newTranscripts);
			clearInterval(timerRef.current);
		}
	};

	useEffect(() => {
		if (questions.length > 0) {
			const newStates = [...questionStates];
			newStates[currentQuestion] = "current";
			setQuestionStates(newStates);
		}
	}, [currentQuestion, questions]);

	const handleQuizCompletion = async (questions, answers) => {
		try {
			const result = await submitQuiz(questions, answers);
			navigate("/result", {
				state: {
					result: result.data.answers,
					questions: questions,
					answers: answers,
					timeLeft,
				},
			});
		} catch (error) {
			console.error("Failed to submit quiz:", error);
		}
	};

	const handleRestart = () => {
		setCurrentQuestion(0);
		setQuestionStates(Array(questions.length).fill("unattempted"));
		setTranscripts(Array(questions.length).fill(""));
		setCompleted(false);
		setTimeLeft(600);
		timerRef.current = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(timerRef.current);
					setCompleted(true);
					handleQuizCompletion(questions, transcripts);
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);
	};

	const handleRecordingStart = () => {
		setIsRecording(true);
	};

	const handleRecordingStop = () => {
		setIsRecording(false);
	};

	const handleTranscript = (transcript) => {
		const newTranscripts = [...transcripts];
		newTranscripts[currentQuestion] = transcript;
		setTranscripts(newTranscripts);
	};

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
	};

	return (
		<div className={styles.quizContainer}>
			<h1 className={styles.title}>Quiz</h1>
			<div className={styles.questionStates}>
				{questionStates.map((state, index) => (
					<span
						key={index}
						className={`${styles.circle} ${styles[state]}`}
					></span>
				))}
			</div>
			<div className={styles.timer}>Time Left: {formatTime(timeLeft)}</div>
			{!completed ? (
				questions.length > 0 && (
					<div>
						<Question
							key={currentQuestion} // Force re-render
							question={questions[currentQuestion]}
							onNext={handleNext}
							questionIndex={currentQuestion}
							transcript={transcripts[currentQuestion]}
							setTranscript={handleTranscript}
							onRecordingStart={handleRecordingStart}
							onRecordingStop={handleRecordingStop}
							isRecording={isRecording}
						/>
					</div>
				)
			) : (
				<div className={styles.loadingContainer}>
					<div className={styles.loading}></div>
					<p className={styles.loadingText}>Loading...</p>
				</div>
			)}
		</div>
	);
}

export default QuizPage;
