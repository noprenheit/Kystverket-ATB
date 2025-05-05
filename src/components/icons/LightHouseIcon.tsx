import React from 'react';
import Svg, { Path } from 'react-native-svg';

const LighthouseIcon: React.FC<{ width?: number; height?: number }> = ({ width = 60, height = 60 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 1024 1024">
      <Path d="M512 938.666667H128l106.666667-725.312h170.666666z" fill="#CFD8DC" />
      <Path d="M222.122667 298.666667l-25.109334 170.666666h245.973334l-25.109334-170.666666zM490.048 789.333333l-25.109333-170.666666H175.061333l-25.109333 170.666666zM256 128h128v128h-128z" fill="#FF3D00" />
      <Path d="M896 298.666667l-512-85.333334V170.666667l512-64z" fill="#FFC107" />
      <Path d="M256 128h128l-64-42.666667zM216.896 341.333333h206.208l-5.909333-42.666666h-194.389334z" fill="#D32F2F" />
      <Path d="M192 213.354667h256v85.333333H192zM362.666667 597.333333v-64a42.666667 42.666667 0 0 0-85.333334 0v64h85.333334z" fill="#455A64" />
    </Svg>
  );
};

export default LighthouseIcon;
