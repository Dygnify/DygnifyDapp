import React, { useState } from "react";

const FileUploader = ({
  name,
  label,
  className,
  onBlur,
  error,
  handleFile,
}) => {
  const hiddenFileInput = React.useRef(null);

  const [fileUploadedName, setFileUploadedName] = useState();

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setFileUploadedName(fileUploaded.name);
    console.log(fileUploaded.name);
    handleFile(fileUploaded);
  };
  return (
    <div className={`${className}`}>
      <label class="label" style={{ marginBottom: 3 }}>
        <span class="text-white">{label}</span>
      </label>
      <div style={{ display: "flex" }} className="flex-row items-center gap-4">
        <div
          className="bg-[#18191a]"
          onClick={handleClick}
          style={{
            borderRadius: "37px",
            color: "white",
            padding: "8px 24px",
            cursor: "pointer",
          }}
        >
          Choose file
        </div>
        <div style={{ color: "#c7cad1", fontStyle: "italic" }}>
          {fileUploadedName}
        </div>
      </div>
      <input
        type="file"
        name={name}
        onBlur={onBlur}
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      {error && (
        <p style={{ color: "red", margin: "0px" }}>
          <small>{error}</small>
        </p>
      )}
    </div>
  );
};
export default FileUploader;
