import React, { useState, useRef } from "react";
import styles from "./Question.module.css";

function Question({ question, onNext, questionIndex }) {
	const [isRecording, setIsRecording] = useState(false);
	const [transcript, setTranscript] = useState("");
	const recognitionRef = useRef(null);

	const startRecording = () => {
		setIsRecording(true);
		recognitionRef.current.start();
	};

	const stopRecording = () => {
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
		};

		recognitionRef.current.onend = () => {
			setIsRecording(false);
		};
	}

	const handleNext = () => {
		onNext(transcript, !transcript);
	};

	const handleSkip = () => {
		onNext("", true);
	};

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
