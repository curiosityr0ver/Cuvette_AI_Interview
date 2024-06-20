import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";
import submitIntro from "../api/submitIntro";

const LandingPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		phone: "",
		fullName: "",
		linkedin: "",
		resume: null,
	});

	const [error, setError] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			console.log(user);
			setFormData(user);
		}
	}, []);

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === "resume") {
			setFormData({ ...formData, resume: files[0] });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.linkedin && !formData.resume) {
			setError("Please provide either a LinkedIn profile or a resume.");
		} else {
			setError("");
			const response = await submitIntro(formData);
			if (response.status === 201) {
				console.log(response.data);
				localStorage.setItem("user", JSON.stringify(formData));
				navigate("/quiz");
			}
		}
	};

	return (
		<div className={styles.container}>
			<h1>Enter Your Details</h1>
			<form onSubmit={handleSubmit} className={styles.form}>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={formData.email}
					onChange={handleChange}
					required
					className={styles.input}
				/>
				<input
					type="tel"
					name="phone"
					placeholder="Phone"
					value={formData.phone}
					onChange={handleChange}
					required
					className={styles.input}
				/>
				<input
					type="text"
					name="fullName"
					placeholder="Full Name"
					value={formData.fullName}
					onChange={handleChange}
					required
					className={styles.input}
				/>
				<input
					type="url"
					name="linkedin"
					placeholder="LinkedIn Profile"
					value={formData.linkedin}
					onChange={handleChange}
					className={styles.input}
				/>
				<div className={styles.orSeparator}>OR</div>
				<label className={styles.fileLabel}>
					Upload Resume (PDF):
					<input
						type="file"
						name="resume"
						accept="application/pdf"
						onChange={handleChange}
						className={styles.inputFile}
					/>
				</label>
				{error && <div className={styles.error}>{error}</div>}
				<button type="submit" className={styles.submitButton}>
					Submit
				</button>
			</form>
		</div>
	);
};

export default LandingPage;
