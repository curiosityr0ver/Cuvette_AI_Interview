import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Question from "./Question";
import styles from "./QuizPage.module.css";
import questionsData from "../data/questions";
import submitQuiz from "../api/submitQuiz";

function QuizPage() {
	const [questions, setQuestions] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [questionStates, setQuestionStates] = useState([]);
	const [transcripts, setTranscripts] = useState([]);
	const [completed, setCompleted] = useState(false);
	const [startTime, setStartTime] = useState(null);
	const [times, setTimes] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		// Fetch questions from the data file
		const fetchQuestions = async () => {
			const fetchedQuestions = questionsData;
			setQuestions(fetchedQuestions);
			setQuestionStates(Array(fetchedQuestions.length).fill("unattempted"));
			setTranscripts(Array(fetchedQuestions.length).fill(""));
			setStartTime(Date.now());
		};

		fetchQuestions();
	}, []);

	const handleNext = (transcript, skipped) => {
		const endTime = Date.now();
		const timeTaken = endTime - startTime;
		const newTimes = [...times, timeTaken];

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
		setTimes(newTimes);

		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1);
			newStates[currentQuestion + 1] = "current";
			setStartTime(Date.now());
		} else {
			setCompleted(true);
			handleQuizCompletion(questions, newTranscripts, newTimes);
		}
	};

	useEffect(() => {
		if (questions.length > 0) {
			const newStates = [...questionStates];
			newStates[currentQuestion] = "current";
			setQuestionStates(newStates);
		}
	}, [currentQuestion, questions]);

	const handleQuizCompletion = async (questions, answers, times) => {
		try {
			const result = await submitQuiz(questions, answers);
			navigate("/result", {
				state: {
					result: result.data.answers,
					questions: questions,
					answers: answers,
					times: times,
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
		setTimes([]);
		setCompleted(false);
		setStartTime(Date.now());
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
			{!completed ? (
				questions.length > 0 && (
					<Question
						question={questions[currentQuestion]}
						onNext={handleNext}
						questionIndex={currentQuestion}
						transcript={transcripts[currentQuestion]}
						setTranscript={(transcript) => {
							const newTranscripts = [...transcripts];
							newTranscripts[currentQuestion] = transcript;
							setTranscripts(newTranscripts);
						}}
					/>
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
