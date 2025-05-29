import React from 'react';
import PropTypes from 'prop-types';

const SectionTitle = ({ children, className = '' }) => (
  <h2 className={`text-xl font-semibold text-blue-700 mb-4 ${className}`}>
    {children}
  </h2>
);

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default SectionTitle;
