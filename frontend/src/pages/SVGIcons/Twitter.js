import React from "react";

const Twitter = ({ className = "default" }) => {
	return (
		<svg
			width={`${className === "default" ? "16" : ""}`}
			height={`${className === "default" ? "16" : ""}`}
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`${className !== "default" ? className : ""}`}
		>
			<path
				d="M14.4996 3.97344C14.0215 4.17969 13.5012 4.32813 12.9652 4.38594C13.5217 4.05537 13.9383 3.53313 14.1371 2.91719C13.615 3.2278 13.043 3.44561 12.4465 3.56094C12.1972 3.29442 11.8957 3.0821 11.5607 2.93721C11.2258 2.79231 10.8646 2.71795 10.4996 2.71876C9.02305 2.71876 7.83555 3.91563 7.83555 5.38438C7.83555 5.59063 7.86055 5.79688 7.90117 5.99532C5.69023 5.87969 3.71836 4.82344 2.40742 3.20626C2.16856 3.61425 2.04338 4.0788 2.04492 4.55157C2.04492 5.47657 2.51523 6.29219 3.23242 6.77188C2.80977 6.75524 2.39702 6.63907 2.02773 6.43282V6.46563C2.02773 7.76094 2.94336 8.83438 4.16367 9.08126C3.93454 9.14077 3.69884 9.17122 3.46211 9.17188C3.28867 9.17188 3.12461 9.15469 2.95898 9.13126C3.29648 10.1875 4.2793 10.9547 5.44961 10.9797C4.53398 11.6969 3.38711 12.1188 2.1418 12.1188C1.91836 12.1188 1.71211 12.1109 1.49805 12.0859C2.6793 12.8438 4.08086 13.2813 5.59023 13.2813C10.4902 13.2813 13.1715 9.22188 13.1715 5.69844C13.1715 5.58282 13.1715 5.46719 13.1637 5.35157C13.6824 4.97188 14.1371 4.50157 14.4996 3.97344Z"
				fill="none"
			/>
		</svg>
	);
};

export default Twitter;
