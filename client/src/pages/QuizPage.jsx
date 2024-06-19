import React, { useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import questions from "../data/questions"; // Importing questions from the data directory
import axios from "axios";
import styles from "./QuizPage.module.css";

const QuizPage = () => {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [recordedBlobs, setRecordedBlobs] = useState([]);
	const [quizCompleted, setQuizCompleted] = useState(false);

	const { status, startRecording, stopRecording, mediaBlobUrl } =
		useReactMediaRecorder({ audio: true });

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeElapsed((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const handleStartRecording = () => {
		startRecording();
	};

	const handleStopRecording = async () => {
		stopRecording();
	};

	useEffect(() => {
		if (mediaBlobUrl) {
			fetch(mediaBlobUrl)
				.then((res) => res.blob())
				.then((blob) => {
					const updatedBlobs = [...recordedBlobs];
					updatedBlobs[currentQuestion] = blob;
					setRecordedBlobs(updatedBlobs);
				});
		}
	}, [mediaBlobUrl]);

	const handleNext = () => {
		if (currentQuestion === questions.length - 1) {
			setQuizCompleted(true);
			submitQuiz();
		} else {
			setCurrentQuestion((prev) => prev + 1);
		}
	};

	const handleSkip = () => {
		if (currentQuestion === questions.length - 1) {
			setQuizCompleted(true);
			submitQuiz();
		} else {
			setRecordedBlobs((prevBlobs) => {
				const updatedBlobs = [...prevBlobs];
				updatedBlobs[currentQuestion] = "skipped";
				return updatedBlobs;
			});
			setCurrentQuestion((prev) => prev + 1);
		}
	};

	const handleReRecord = () => {
		setRecordedBlobs((prevBlobs) => {
			const updatedBlobs = [...prevBlobs];
			updatedBlobs[currentQuestion] = null;
			return updatedBlobs;
		});
		startRecording(); // Automatically start recording again
	};

	const submitQuiz = async () => {
		const formData = new FormData();
		recordedBlobs.forEach((blob, index) => {
			if (blob && blob !== "skipped") {
				formData.append(
					`question_${index + 1}`,
					blob,
					`question_${index + 1}.webm`
				);
			} else {
				formData.append(`question_${index + 1}`, "skipped");
			}
		});

		try {
			const response = await axios.post(
				"http://localhost:5000/api/evaluation",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			console.log("Submission successful:", response.data);
		} catch (error) {
			console.error("Error submitting quiz:", error);
		}
	};

	useEffect(() => {
		console.log(recordedBlobs);
	}, [recordedBlobs]);

	return (
		<div className={styles.container}>
			<div className={styles.timer}>
				<span>Time Elapsed: {timeElapsed} seconds</span>
			</div>
			{!quizCompleted && (
				<div>
					<div className={styles.questionTimeline}>
						{questions.map((q, index) => (
							<span
								key={q.id}
								className={
									index === currentQuestion
										? styles.currentQuestion
										: recordedBlobs[index] === "skipped"
										? styles.skippedQuestion
										: recordedBlobs[index]
										? styles.answeredQuestion
										: styles.notAttemptedQuestion
								}
							>
								{index + 1}
							</span>
						))}
					</div>
					<div className={styles.questionContainer}>
						<h2>{questions[currentQuestion].text}</h2>
						<div className={styles.recordingControls}>
							{!recordedBlobs[currentQuestion] ||
							recordedBlobs[currentQuestion] === "skipped" ? (
								<div>
									<div>
										{status === "recording" ? (
											<button onClick={handleStopRecording}>
												Stop Recording
											</button>
										) : (
											<button onClick={handleStartRecording}>
												Start Recording
											</button>
										)}
									</div>
								</div>
							) : (
								<div>
									<audio controls>
										<source
											src={URL.createObjectURL(recordedBlobs[currentQuestion])}
											type="audio/webm"
										/>
										Your browser does not support the audio element.
									</audio>
									<button onClick={handleReRecord}>Re-record</button>
								</div>
							)}
						</div>
						<button onClick={handleNext}>Next</button>
						<button onClick={handleSkip}>Skip</button>
					</div>
				</div>
			)}
			{quizCompleted && (
				<div className={styles.completedContainer}>
					<h2>Quiz Completed!</h2>
					<button onClick={() => window.location.reload()}>Restart Quiz</button>
					<div>
						{recordedBlobs.map((blob, index) => (
							<div key={index}>
								{blob && blob !== "skipped" && (
									<div>
										<audio controls>
											<source
												src={URL.createObjectURL(blob)}
												type="audio/webm"
											/>
											Your browser does not support the audio element.
										</audio>
									</div>
								)}
								{blob === "skipped" && <p>Question {index + 1} was skipped</p>}
								{!blob && <p>Question {index + 1} was not attempted</p>}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default QuizPage;
