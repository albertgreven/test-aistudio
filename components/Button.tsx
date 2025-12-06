import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-twee-gold text-twee-dark hover:bg-twee-gold-hover shadow-lg hover:shadow-xl",
    secondary: "bg-twee-blue text-white hover:bg-blue-800 shadow-md",
    outline: "border-2 border-twee-gold text-twee-gold hover:bg-twee-gold hover:text-twee-dark"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
