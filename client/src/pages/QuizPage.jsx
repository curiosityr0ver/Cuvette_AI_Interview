import { useState, useEffect } from "react";
import Question from "./Question";
import styles from "./QuizPage.module.css";
import questionsData from "../data/questions";

function QuizPage() {
	const [questions, setQuestions] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [questionStates, setQuestionStates] = useState([]);
	const [transcripts, setTranscripts] = useState([]);
	const [completed, setCompleted] = useState(false);

	useEffect(() => {
		// Fetch questions from the data file
		const fetchQuestions = async () => {
			// Simulate a fetch call
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
		}
	};

	useEffect(() => {
		if (questions.length > 0) {
			const newStates = [...questionStates];
			newStates[currentQuestion] = "current";
			setQuestionStates(newStates);
		}
	}, [currentQuestion, questions]);

	const handleRestart = () => {
		setCurrentQuestion(0);
		setQuestionStates(Array(questions.length).fill("unattempted"));
		setTranscripts(Array(questions.length).fill(""));
		setCompleted(false);
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
				<div className={styles.answerContainer}>
					<h2 className={styles.subtitle}>All Answers</h2>
					<ul className={styles.answerList}>
						{questions.map((question, index) => (
							<li key={index} className={styles.answerItem}>
								<strong>{question}</strong>: {transcripts[index] || "Skipped"}
							</li>
						))}
					</ul>
					<button
						onClick={handleRestart}
						className={`${styles.button} ${styles.restartButton}`}
					>
						Restart Quiz
					</button>
				</div>
			)}
		</div>
	);
}

export default QuizPage;
