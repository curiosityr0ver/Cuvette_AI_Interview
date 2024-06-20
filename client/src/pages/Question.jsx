/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import styles from "./Question.module.css";

function Question({ question, onNext, transcript, setTranscript }) {
	const [isRecording, setIsRecording] = useState(false);
	const [isRecognitionReady, setIsRecognitionReady] = useState(true);
	const recognitionRef = useRef(null);

	const startRecording = () => {
		if (!isRecognitionReady) return;

		setIsRecording(true);
		recognitionRef.current.start();
	};

	const stopRecording = () => {
		if (!isRecording) return;

		setIsRecording(false);
		recognitionRef.current.stop();
	};

	const handleToggleRecording = () => {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	};

	useEffect(() => {
		if (!("webkitSpeechRecognition" in window)) {
			alert(
				"Web Speech API is not supported by this browser. Please use Google Chrome."
			);
		} else {
			const SpeechRecognition =
				window.webkitSpeechRecognition || window.SpeechRecognition;
			recognitionRef.current = new SpeechRecognition();
			recognitionRef.current.continuous = false;
			recognitionRef.current.interimResults = false;
			recognitionRef.current.lang = "en-US";

			recognitionRef.current.onresult = (event) => {
				const lastResult = event.results.length - 1;
				const transcript = event.results[lastResult][0].transcript;
				setTranscript(transcript);
			};

			recognitionRef.current.onerror = (event) => {
				console.error("Speech recognition error", event);
				setIsRecording(false);
				setIsRecognitionReady(true);
			};

			recognitionRef.current.onend = () => {
				setIsRecording(false);
				setIsRecognitionReady(true);
			};
		}
	}, [setTranscript]);

	const handleNext = () => {
		onNext(transcript, !transcript);
	};

	const handleSkip = () => {
		onNext("", true);
	};

	useEffect(() => {
		setIsRecording(false);
		setIsRecognitionReady(true);
	}, [question]);

	return (
		<div className={styles.questionContainer}>
			<h2 className={styles.questionText}>{question}</h2>
			<div className={styles.recordContainer}>
				<button
					onClick={handleToggleRecording}
					className={`${styles.button} ${
						isRecording ? styles.stopButton : styles.recordButton
					}`}
				>
					{isRecording
						? "Stop Recording"
						: transcript
						? "Re-record"
						: "Start Recording"}
				</button>
				{isRecording && <div className={styles.recordIndicator}></div>}
			</div>
			<p className={styles.transcript}>Transcript: {transcript}</p>
			<div className={styles.buttonContainer}>
				<button
					onClick={handleNext}
					className={`${styles.button} ${styles.nextButton}`}
				>
					Next
				</button>
				<button
					onClick={handleSkip}
					className={`${styles.button} ${styles.skipButton}`}
				>
					Skip
				</button>
			</div>
		</div>
	);
}

export default Question;
