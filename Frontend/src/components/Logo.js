import React from 'react';

const Logo = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="20" y="20" width="160" height="160" rx="40" fill="#4F46E5"/>
      <path d="M55 100L85 135L115 65L145 100" stroke="white" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="55" cy="100" r="6" fill="white"/>
      <circle cx="85" cy="135" r="6" fill="white"/>
      <circle cx="115" cy="65" r="6" fill="white"/>
      <circle cx="145" cy="100" r="6" fill="white"/>
    </svg>
  );
};

export default Logo;
