import React from "react";

function Button({ children, className = "", type = "submit", ...props }) {
  return (
    <button className={`${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
