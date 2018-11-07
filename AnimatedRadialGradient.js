import React, { Component } from 'react';
import { Animated } from 'react-native';
import Svg, { RadialGradient, Defs, Stop } from 'react-native-svg';

class AnimatedRadialGradientWrapper extends React.Component {
  render() {
    const {children, ...props } = this.props;
    return (
      <Defs>
        <RadialGradient           
          {...props}
        >
          {children}
        </RadialGradient>
      </Defs>
    );
  }
}
export const AnimatedRadialGradient = Animated.createAnimatedComponent(AnimatedRadialGradientWrapper);

class AnimatedStopWrapper extends React.Component {
  render() {
    const {children, ...props } = this.props;
    console.log(props);
    return (
      <Stop {...props}>
        {children}
      </Stop>
    );
  }
}
export const AnimatedStop = Animated.createAnimatedComponent(AnimatedStopWrapper);


