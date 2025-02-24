import React from 'react';

export const ViewProfile = ({ size = 30, viewBox = '0 0 30 30', ...props }) => (
  <svg
    fill="none"
    height={size}
    strokeWidth={2}
    viewBox={viewBox}
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.06372 23.3832C7.9983 21.7245 11.3886 20.7778 15 20.7778C18.6114 20.7778 22.0017 21.7245 24.9363 23.3832M19.3333 12.1111C19.3333 14.5043 17.3932 16.4444 15 16.4444C12.6068 16.4444 10.6667 14.5043 10.6667 12.1111C10.6667 9.71788 12.6068 7.77778 15 7.77778C17.3932 7.77778 19.3333 9.71788 19.3333 12.1111ZM28 15C28 22.1797 22.1797 28 15 28C7.8203 28 2 22.1797 2 15C2 7.8203 7.8203 2 15 2C22.1797 2 28 7.8203 28 15Z"
      stroke="#121212"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.67"
      transform="scale(1,1)"
    />
  </svg>
);
