import React from "react";

const DocumentCard = ({ docName, doc }) => {
  return (
    <div
      style={{
        backgroundColor: "#20232A",
        borderRadius: "8px",
        display: "flex",
        padding: "11px 16px",
      }}
      className="justify-between mb-2"
    >
      <div>
        <p>{docName ? null : "View Document"}</p>
        {docName ? (
          <p style={{ fontStyle: "italic", color: "#E6E6E6" }}> {docName}</p>
        ) : null}
      </div>
      <a className="text-blue-700" href="#">
        View Document
      </a>
    </div>
  );
};

export default DocumentCard;
