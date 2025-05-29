import React from 'react';
import PropTypes from 'prop-types';
import { Input as MTInput } from '@material-tailwind/react';

const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  className = '',
  error = false,
  helperText = '',
  ...props
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && (
      <label className="text-sm font-medium text-gray-700">{label}</label>
    )}
    <MTInput
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
        error
          ? 'border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:ring-blue-500'
      }`}
      {...props}
    />
    {helperText && (
      <span className="text-xs text-red-600 mt-1">{helperText}</span>
    )}
  </div>
);

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string
};

export default Input;
