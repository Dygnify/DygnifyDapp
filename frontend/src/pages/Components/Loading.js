import React from "react";

const Loading = () => {
  return (
    <div>
      <div class="flex justify-center items-center" style={{ display: "flex" }}>
        <div
          class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue"
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
