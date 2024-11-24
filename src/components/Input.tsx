import {InputHTMLAttributes} from 'react';

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  isTextArea?: boolean;
}

export const Input = ({
  isTextArea = false,
  className = '',
  ...props
}: InputProps) => {
  const baseClassName = `block w-full px-3 py-2 text-lg 
    text-gray-900 dark:text-white
    bg-white dark:bg-gray-800 
    border border-gray-300 dark:border-gray-700 
    rounded-md
    focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400
    focus:border-green-500 dark:focus:border-green-400
    placeholder-gray-400 dark:placeholder-gray-500`;

  const combinedClassName = `${baseClassName} ${className}`;

  return isTextArea ? (
    <textarea className={combinedClassName} {...props} />
  ) : (
    <input className={combinedClassName} {...props} />
  );
};
