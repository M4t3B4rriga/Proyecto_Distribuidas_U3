const Button = ({ onClick, children, className = "" }) => {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  