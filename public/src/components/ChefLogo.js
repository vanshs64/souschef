// filepath: /src/components/ChefLogo.js
import React from 'react';
import { motion } from 'framer-motion';

const ChefLogo = () => {
  return (
    <motion.svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="chef-logo"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* SVG content */}
    </motion.svg>
  );
};

export default ChefLogo;