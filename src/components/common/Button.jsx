import React from 'react';
import PropTypes from 'prop-types';
import { Button as MTButton } from '@material-tailwind/react';

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
};

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}) => (
  <MTButton
    type={type}
    onClick={onClick}
    className={`${variantStyles[variant]} rounded px-4 py-2 font-medium transition ${className}`}
    {...props}
  >
    {children}
  </MTButton>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  className: PropTypes.string
};

export default Button;
