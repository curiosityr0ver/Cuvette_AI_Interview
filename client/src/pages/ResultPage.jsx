import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ResultPage.module.css";

const ResultPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { result, questions, answers } = location.state || {
		result: null,
		questions: [],
		answers: [],
	};

	useEffect(() => {
		console.log({
			result,
			questions,
			answers,
		});
	}, [result, questions, answers]);

	const getColorForRating = (rating) => {
		if (rating >= 8) {
			return styles.highRating;
		} else if (rating >= 5) {
			return styles.mediumRating;
		} else {
			return styles.lowRating;
		}
	};

	const handleBackToHome = () => {
		navigate("/");
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Quiz Results</h1>
			<div className={styles.resultContainer}>
				<h2 className={styles.subtitle}>Your Answers:</h2>
				<ul className={styles.resultList}>
					{result?.map((res, index) => (
						<li
							key={index}
							className={`${styles.resultItem} ${getColorForRating(res)}`}
						>
							<h3 className={styles.questionTitle}>Question:</h3>
							<p className={styles.question}>{questions[index]}</p>
							<h3 className={styles.answerTitle}>Your Answer:</h3>
							<p className={styles.answer}>{answers[index]}</p>
							<h3 className={styles.ratingTitle}>Rating:</h3>
							<p className={styles.rating}>{res}/10</p>
							<h3 className={styles.remarkTitle}>Remark:</h3>
							<p className={styles.remark}>{res.remark}</p>
						</li>
					))}
				</ul>
			</div>
			<button onClick={handleBackToHome} className={styles.button}>
				Back to Home
			</button>
		</div>
	);
};

export default ResultPage;
