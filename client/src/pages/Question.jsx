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
			setIsRecognizing(false);
			onRecordingStop();
		};

		recognitionRef.current.onend = () => {
			setIsRecognizing(false);
			onRecordingStop();
		};

		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.abort();
				recognitionRef.current = null;
			}
		};
	}, [setTranscript, onRecordingStop]);

	const startRecording = () => {
		if (recognitionRef.current) {
			recognitionRef.current.start();
			onRecordingStart();
			setIsRecognizing(true);
		}
	};

	const stopRecording = () => {
		if (recognitionRef.current && isRecognizing) {
			recognitionRef.current.stop();
			setIsRecognizing(false);
		}
	};

	const handleToggleRecording = () => {
		if (isRecognizing) {
			stopRecording();
		} else {
			startRecording();
		}
	};

	return (
		<div className={styles.questionContainer}>
			<h2 className={styles.questionText}>{question}</h2>
			<div className={styles.recordContainer}>
				<button
					onClick={handleToggleRecording}
					className={`${styles.button} ${
						isRecognizing ? styles.stopButton : styles.recordButton
					}`}
				>
					{isRecognizing
						? "Stop Recording"
						: transcript
						? "Re-record"
						: "Start Recording"}
				</button>
				{isRecognizing && <div className={styles.recordIndicator}></div>}
			</div>
			{transcript && !isRecognizing && (
				<p className={styles.transcript}>Transcript: {transcript}</p>
			)}
			<div className={styles.buttonContainer}>
				<button
					onClick={() => onNext(transcript, false)}
					className={`${styles.button} ${styles.nextButton}`}
					disabled={isRecognizing}
				>
					Next
				</button>
				<button
					onClick={() => onNext("", true)}
					className={`${styles.button} ${styles.skipButton}`}
					disabled={isRecognizing}
				>
					Skip
				</button>
			</div>
		</div>
	);
}

export default Question;
