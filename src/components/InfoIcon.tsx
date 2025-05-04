import React from 'react';
import Svg, { Line, Path } from 'react-native-svg';

interface InfoIconProps {
  size?: number;
  color?: string;
  fillColor?: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({ 
  size = 18, 
  color = '#000000', 
  fillColor = '#2CA9BC' 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path 
        d="M3,12a9,9,0,0,1,9-9h0a9,9,0,0,1,9,9h0a9,9,0,0,1-9,9h0a9,9,0,0,1-9-9Z" 
        fill={fillColor} 
        strokeWidth="2"
      />
      <Line 
        x1="12.05" 
        y1="8" 
        x2="11.95" 
        y2="8" 
        fill="none" 
        stroke={color} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2.5"
      />
      <Path 
        d="M12,13v3M3,12a9,9,0,0,0,9,9h0a9,9,0,0,0,9-9h0a9,9,0,0,0-9-9h0a9,9,0,0,0-9,9Z" 
        fill="none" 
        stroke={color} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2"
      />
    </Svg>
  );
};

export default InfoIcon; 