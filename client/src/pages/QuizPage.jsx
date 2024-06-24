import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import questionsData from "../data/questions";
import submitQuiz from "../api/submitQuiz";
import Footer from "./Footer";
import styles from "./QuizPage.module.css";

function QuizPage() {
	const [questions, setQuestions] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [questionStates, setQuestionStates] = useState([]);
	const [transcripts, setTranscripts] = useState([]);
	const [completed, setCompleted] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
	const [startTime, setStartTime] = useState(Date.now());
	const [timeTaken, setTimeTaken] = useState([]); // Time taken for each question

	const recognitionRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchQuestions = async () => {
			const fetchedQuestions = questionsData;
			setQuestions(fetchedQuestions);
			setQuestionStates(Array(fetchedQuestions.length).fill("unattempted"));
			setTranscripts(Array(fetchedQuestions.length).fill(""));
		};

		fetchQuestions();

		const timerRef = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(timerRef);
					setCompleted(true);
					handleQuizCompletion(questions, transcripts, timeTaken);
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		return () => clearInterval(timerRef);
	}, []);

	useEffect(() => {
		if (
			!("webkitSpeechRecognition" in window) &&
			!("SpeechRecognition" in window)
		) {
			alert(
				"Web Speech API is not supported by this browser. Please use Google Chrome."
			);
			return;
		}

		const SpeechRecognition =
			window.webkitSpeechRecognition || window.SpeechRecognition;
		recognitionRef.current = new SpeechRecognition();
		recognitionRef.current.continuous = true;
		recognitionRef.current.interimResults = false;
		recognitionRef.current.lang = "en-IN";

		recognitionRef.current.onresult = (event) => {
			const lastResult = event.results.length - 1;
			const newTranscript = event.results[lastResult][0].transcript;
			setTranscripts((prevTranscripts) => {
				const newTranscripts = [...prevTranscripts];
				newTranscripts[currentQuestion] = newTranscript;
				return newTranscripts;
			});
		};

		recognitionRef.current.onerror = (event) => {
			console.error("Speech recognition error", event);
			setIsRecording(false);
		};

		recognitionRef.current.onend = () => {
			setIsRecording(false);
		};

		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.abort();
				recognitionRef.current = null;
			}
		};
	}, [currentQuestion]);

	const startRecording = () => {
		if (recognitionRef.current) {
			recognitionRef.current.start();
			setIsRecording(true);
		}
	};

	const stopRecording = () => {
		if (recognitionRef.current && isRecording) {
			recognitionRef.current.stop();
			setIsRecording(false);
		}
	};

	const handleToggleRecording = () => {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	};

	const handleNext = (transcript, skipped) => {
		const endTime = Date.now();
		const timeSpent = (endTime - startTime) / 1000; // Time spent on the current question in seconds

		const newStates = [...questionStates];
		const newTranscripts = [...transcripts];
		const newTimeTaken = [...timeTaken, timeSpent];

		if (skipped) {
			newStates[currentQuestion] = "skipped";
		} else {
			newStates[currentQuestion] = "attempted";
			newTranscripts[currentQuestion] = transcript;
		}

		setQuestionStates(newStates);
		setTranscripts(newTranscripts);
		setTimeTaken(newTimeTaken);
		setIsRecording(false);
		setStartTime(Date.now()); // Reset start time for the next question

		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1);
			newStates[currentQuestion + 1] = "current";
		} else {
			setCompleted(true);
			handleQuizCompletion(questions, newTranscripts, newTimeTaken);
		}
	};

	const handleQuizCompletion = async (questions, answers, times) => {
		try {
			const logEntries = questions.map((q, index) => ({
				question: q,
				answer: answers[index],
				timeTaken: times[index],
			}));
			console.log("Log entries:", logEntries);

			const response = await submitQuiz(questions, answers);
			if (response.status === 200) {
				const { data } = response;
				console.log("Submission successful:", data);
				navigate("/result", {
					state: {
						result: data,
						questions: questions,
						answers: answers,
						timeLeft,
						times,
					},
				});
			}
		} catch (error) {
			console.error("Failed to submit quiz:", error);
		}
	};

	const handleRestart = () => {
		setCurrentQuestion(0);
		setQuestionStates(Array(questions.length).fill("unattempted"));
		setTranscripts(Array(questions.length).fill(""));
		setTimeTaken([]);
		setCompleted(false);
		setTimeLeft(600);
		setStartTime(Date.now());
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
						<div className={styles.questionContainer}>
							<h2 className={styles.questionText}>
								{questions[currentQuestion]}
							</h2>
							<div className={styles.recordContainer}>
								<button
									onClick={handleToggleRecording}
									className={`${styles.button} ${
										isRecording ? styles.stopButton : styles.recordButton
									}`}
								>
									{isRecording
										? "Stop Recording"
										: transcripts[currentQuestion]
										? "Re-record"
										: "Start Recording"}
								</button>
								{isRecording && <div className={styles.recordIndicator}></div>}
							</div>
							{transcripts[currentQuestion] && !isRecording && (
								<p className={styles.transcript}>
									Transcript: {transcripts[currentQuestion]}
								</p>
							)}
							<div className={styles.buttonContainer}>
								<button
									onClick={() =>
										handleNext(transcripts[currentQuestion], false)
									}
									className={`${styles.button} ${styles.nextButton}`}
									disabled={isRecording}
								>
									Next
								</button>
								<button
									onClick={() => handleNext("", true)}
									className={`${styles.button} ${styles.skipButton}`}
									disabled={isRecording}
								>
									Skip
								</button>
							</div>
						</div>
					</div>
				)
			) : (
				<div className={styles.loadingContainer}>
					<div className={styles.loading}></div>
					<p className={styles.loadingText}>Loading...</p>
				</div>
			)}
			<Footer />
		</div>
	);
}

export default QuizPage;
