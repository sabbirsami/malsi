import React from 'react';

interface LogoIconProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

const LogoIcon: React.FC<LogoIconProps> = ({ width = 184, height = 214, className }) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 184 214"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M70 0H97L27.8953 165.32H0L70 0Z" fill="black" />
      <path d="M147.895 48.5384L175.154 48.5384L106 214H78L147.895 48.5384Z" fill="black" />
      <path d="M95.4995 3.07874e-05L125.999 0L80 214H51L95.4995 3.07874e-05Z" fill="black" />
      <path d="M170.499 48.5H183.999V164.5H154.999L170.499 48.5Z" fill="black" />
    </svg>
  );
};

export default LogoIcon;
