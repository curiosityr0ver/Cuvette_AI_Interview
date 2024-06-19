import React, { useState } from "react";
import Question from "./Question";
import styles from "./QuizPage.module.css";

const questions = [
	"What is your name?",
	"How old are you?",
	"What is your favorite programming language?",
];

function QuizPage() {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [questionStates, setQuestionStates] = useState(
		Array(questions.length).fill("unattempted")
	);
	const [transcripts, setTranscripts] = useState(
		Array(questions.length).fill("")
	);
	const [completed, setCompleted] = useState(false);

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
		} else {
			setCompleted(true);
		}
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
				<Question
					question={questions[currentQuestion]}
					onNext={handleNext}
					questionIndex={currentQuestion}
				/>
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
				</div>
			)}
		</div>
	);
}

export default QuizPage;
