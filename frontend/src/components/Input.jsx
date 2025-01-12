function Input({
  label,
  placeholder = "Enter value",
  type = "text",
  className = "",
  ...props
}) {
  return (
    <>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={`border-2 px-4 py-3 mb-3 ${className}`}
        {...props}
      />
    </>
  );
}

export default Input;
