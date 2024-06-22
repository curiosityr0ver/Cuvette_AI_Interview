import React, { useRef, useEffect, useState } from "react";
import styles from "./Question.module.css";

function Question({
	question,
	onNext,
	transcript,
	setTranscript,
	onRecordingStart,
	onRecordingStop,
	isRecording,
}) {
	const recognitionRef = useRef(null);
	const [isRecognizing, setIsRecognizing] = useState(false);
	const [startTime, setStartTime] = useState(null);
	const [timeToSpeak, setTimeToSpeak] = useState(null);

	const startRecording = () => {
		if (recognitionRef.current) {
			onRecordingStart();
			recognitionRef.current.start();
			setIsRecognizing(true);
		}
	};

	const stopRecording = () => {
		if (recognitionRef.current) {
			recognitionRef.current.onend = null; // Temporarily remove the onend handler
			recognitionRef.current.stop();
			setIsRecognizing(false);
			onRecordingStop();
		}
	};

	const handleToggleRecording = () => {
		if (isRecognizing) {
			stopRecording();
		} else {
			startRecording();
			const endTime = Date.now();
			const timeTaken = (endTime - startTime) / 1000; // Time in seconds
			console.log(`Time taken before starting to speak: ${timeTaken} seconds`);
			setTimeToSpeak(timeTaken);
		}
	};

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
		recognitionRef.current.lang = "en-US";

		recognitionRef.current.onresult = (event) => {
			const lastResult = event.results.length - 1;
			const newTranscript = event.results[lastResult][0].transcript;
			setTranscript(newTranscript);
		};

		recognitionRef.current.onerror = (event) => {
			console.error("Speech recognition error", event);
			stopRecording();
		};

		recognitionRef.current.onend = () => {
			stopRecording();
		};

		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
				recognitionRef.current = null;
			}
		};
	}, [setTranscript, onRecordingStop]);

	useEffect(() => {
		setStartTime(Date.now());
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
				{isRecognizing && <div className={styles.recordIndicator}></div>}
			</div>
			{transcript && !isRecognizing && (
				<p className={styles.transcript}>
					Transcript: {transcript} <br />
					Time taken before speaking: {timeToSpeak} seconds
				</p>
			)}
			<div className={styles.buttonContainer}>
				<button
					onClick={() => onNext(transcript, false)}
					className={`${styles.button} ${styles.nextButton}`}
				>
					Next
				</button>
				<button
					onClick={() => onNext("", true)}
					className={`${styles.button} ${styles.skipButton}`}
				>
					Skip
				</button>
			</div>
		</div>
	);
}

export default Question;
