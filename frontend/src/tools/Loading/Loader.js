function Loader() {
	return (
		<div
			style={{ display: "flex" }}
			className="z-20 absolute inset-0 items-center justify-center"
		>
			<div className="animate-spin border-solid border-4 border-t-[#14171F] border-[#fff] w-[5rem] h-[5rem] rounded-full"></div>
		</div>
	);
}

export default Loader;
