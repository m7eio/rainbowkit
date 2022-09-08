import React from 'react';

export const EditProfile = ({ size = 19, viewBox = '0 0 19 19', ...props }) => (
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
      d="M8 3H3C1.89543 3 1 3.89543 1 5V16C1 17.1046 1.89543 18 3 18H14C15.1046 18 16 17.1046 16 16V11M14.5858 1.58579C15.3668 0.804738 16.6332 0.804738 17.4142 1.58579C18.1953 2.36683 18.1953 3.63316 17.4142 4.41421L8.82842 13H6L6 10.1716L14.5858 1.58579Z"
      stroke="#121212"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);
