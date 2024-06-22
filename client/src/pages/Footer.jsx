import React from "react";
import styles from "./Footer.module.css";
import logo from "../assets/cuvette_logo.png"; // Ensure you have the logo image in the correct path

const Footer = () => {
	return (
		<div className={styles.footer}>
			<img src={logo} alt="Cuvette Tech Logo" className={styles.logo} />
			<a
				href="https://cuvette.tech"
				target="_blank"
				rel="noopener noreferrer"
				className={styles.link}
			>
				Visit Cuvette Tech
			</a>
		</div>
	);
};

export default Footer;
