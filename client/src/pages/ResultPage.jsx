import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ResultPage.module.css";

const ResultPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { result, questions, answers, times } = location.state || {
		result: null,
		questions: [],
		answers: [],
		times: [],
	};

	useEffect(() => {
		console.log({
			result,
			questions,
			answers,
			times,
		});
	}, [result, questions, answers, times]);

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
				<table className={styles.resultTable}>
					<thead>
						<tr>
							<th>Question</th>
							<th>Your Answer</th>
							<th>Rating</th>
							<th>Remark</th>
							<th>Time Taken (s)</th>
						</tr>
					</thead>
					<tbody>
						{result?.map((res, index) => (
							<tr key={index} className={getColorForRating(res.rating)}>
								<td>{questions[index]}</td>
								<td>{answers[index]}</td>
								<td>{res.rating}/10</td>
								<td>{res.remark}</td>
								<td>{(times[index] / 1000).toFixed(2)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<button onClick={handleBackToHome} className={styles.button}>
				Back to Home
			</button>
		</div>
	);
};

export default ResultPage;
