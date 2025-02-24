const InputField = ({ type, value, onChange, placeholder }) => {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    );
  };
  
  export default InputField;