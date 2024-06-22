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
	const [isRecording, setIsRecording] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		// Fetch questions from the data file
		const fetchQuestions = async () => {
			const fetchedQuestions = questionsData;
			setQuestions(fetchedQuestions);
			setQuestionStates(Array(fetchedQuestions.length).fill("unattempted"));
			setTranscripts(Array(fetchedQuestions.length).fill(""));
		};

		fetchQuestions();
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

		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1);
			newStates[currentQuestion + 1] = "current";
		} else {
			setCompleted(true);
			handleQuizCompletion(questions, newTranscripts);
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
					<div>
						<Question
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
