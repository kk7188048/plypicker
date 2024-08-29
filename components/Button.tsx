import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button
      className="w-full px-4 py-3 rounded-md bg-indigo-600 text-white font-bold text-lg flex items-center justify-center gap-2"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;