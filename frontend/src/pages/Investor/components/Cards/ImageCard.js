import React from "react";

const ImageCard = ({ src, className, style }) => {
	return (
		<div className="avatar">
			<div style={style} className={className}>
				<img alt="logo" src={src} />
			</div>
		</div>
	);
};

export default ImageCard;
