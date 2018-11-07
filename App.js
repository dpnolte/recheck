/**
 * Recheck React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions, Animated, ScrollView, TouchableOpacity} from 'react-native';
import {AnimatedRadialGradient, AnimatedStop} from './AnimatedRadialGradient';

const radiantColors = [
  "black",
  // purple
  "#b365fd",
  // red
  "#ff6767",
  // yellow
  "#fefc56",  
  // green
  "#69fe8b",
  // magenta
  "#ccffff",
  "black",
];
const colorPerUnit = 1/(radiantColors.length * 2 - 1)
const lastRadiantColorIndex = radiantColors.length - 1


type Props = {};
export default class App extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.windowDimensions = Dimensions.get('window');
    this.state = {
      animatingBackground: false,
      backgroundColor: new Animated.Value(0),
      radiantColors: [],
      topRow: 100,
      middleRow: 250,
      //bottomRow: 395,
    }
    this.state.backgroundColor.addListener(({value}) => this.onBackgroundColorChange(value));
  }
  componentDidMount() {
    this.animateBackgroundColor();
  }
  animateBackgroundColor() {
    Animated.parallel([
      Animated.timing(this.state.backgroundColor, {
        toValue: 1, 
      }),
    ], {
      useNativeDriver: true,
    }).start();
  }
  onBackgroundColorChange(value) {
    // we should cap the rainbow on background color 
    // (first stop should always be side menu background color)
    // at 1, all colors should be gone except for bg color
    // at 0, the first custom color should be visible

    // 4 values..
    // #1 at 1/7, only 1st color visible
    // #2 at 2/7 -> 2nd, 1st
    // #3 at 3/7 -> 3rd, 2nd, 1st
    // #4 at 4/7 -> 4th, 3rd, 2nd, 1st
    // #5 at 5/7 -> 4th, 3rd, 2nd
    // #6 at 6/7 -> 4th, 3rd
    // #7 at 7/7 -> 4th

    const colors = [];
    const unitsInValue = Math.round(value / colorPerUnit) 
    const startingIndex = unitsInValue > radiantColors.length ? unitsInValue - radiantColors.length : 0
    let valueAtColor = value
    let index = startingIndex
    while(valueAtColor >= 0 && index <= lastRadiantColorIndex) {
      colors.push({
        color: radiantColors[index],
        offset: valueAtColor.toFixed(3),
      })
      valueAtColor -= colorPerUnit
      index += 1
    }
    
    this.setState({
      radiantColors: colors,
      animatingSideMenuBackground: 0 < value && value < 1
    });
  }
  getRadiantColorStops() {
    const colors = []
    this.state.radiantColors.forEach(color => {
      if (color.offset <= 1 && color.offset >= 0) {
        colors.push(
          <AnimatedStop
            key={color.color}
            offset={color.offset}
            stopColor={color.color}
            stopOpacity="1"
          />
        );
      }
    });
    return colors;
  }
  render() {
    const deviceWidth = this.windowDimensions.width
    const { topRow, middleRow, bottomRow } = this.state;
    return (
      <ScrollView style={styles.container} ref={(scroller) => {this.scroller = scroller}}>
        <View style={styles.logoContainer}>
          <AnimatedRadialGradient 
                    style={{ width: '100%', height: '100%', zIndex: 999}}
                    id="grad"
                    cx="100" cy="300"
                    rx="600" ry="600"
                    fx="100" fy="300"
                    gradientUnits="userSpaceOnUse"
                  >
                    {this.getRadiantColorStops()}
                  </AnimatedRadialGradient>
          <TouchableOpacity onPress={() => { this.scroller.scrollTo({ x: 0 , y: 565 })}}>
            <Image style={styles.logo} source={require('./assets/images/logo.png')} />
            <Text style={styles.subscript}>OFFICIAL PRODUCT</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productDetailsContainer}>
          <TouchableOpacity onPress={() => { this.scroller.scrollTo({ x: 0 , y: 1130 })}}>
            <Image style={styles.tshirt} source={require('./assets/images/tshirt.png')} />
          </TouchableOpacity>
          <View style={styles.productDetails}>
            <Text style={{ color: '#DEDEDE', fontWeight: 'bold', fontSize: 18 }}>PRODUCT</Text>
            <Image source={require('./assets/images/adidas.png')} style={{ width: 74, height: 50, opacity: 0.9 }} />
            <Text style={{ color: '#CCC', fontWeight: 'bold', fontSize: 24, top: -50, left: 90}}>Adidas Ag</Text>
            <Text style={{ color: '#BBB', fontWeight: 'bold', fontSize: 16, top: -50, left: 90}}>Herzogenaurach, Germany</Text>
          </View>
          <View style={styles.statusDetails}>
            <Text style={{ color: '#DEDEDE', fontWeight: 'bold', fontSize: 18 }}>STATUS</Text>
            <Image source={require('./assets/images/check.png')} style={{ width: 50, height: 50, marginLeft: 12, marginRight: 12, opacity: 0.8 }} />
            <Text style={{ color: '#EEE', fontWeight: 'bold', fontSize: 18, top: -50, left: 90}}>This item is validated as</Text>
            <Text style={{ color: '#EEE', fontWeight: 'bold', fontSize: 18, top: -50, left: 90}}>authentic and has an owner</Text>
          </View>          
          <View style={styles.productIdDetails}>
            <Text style={{ color: '#DEDEDE', fontWeight: 'bold', fontSize: 18 }}>PRODUCT ID</Text>
            <Text style={{ color: '#BBB', fontWeight: 'bold', fontSize: 16, left: 0, top: 10}}>Fx2x52Ev7X6q19</Text>
            <Image source={require('./assets/images/qrcode.png')} style={{ width: 70, height: 70, marginLeft: 260, opacity: 0.8, top: -40 }} />
          </View>          
        </View>
        <View style={styles.badgesContainer}>   
          <Text style={{ color: 'white', fontSize: 30, textAlign: 'center', top: 10 }}>BADGES</Text>
          {/* top row */}     
          <View style={[styles.badge, { top: topRow, left: 10, } ]}>
            <TouchableOpacity onPress={() => { this.scroller.scrollTo({ x: 0 , y: 0 })}}>
              <Image style={styles.imageBadge} source={require('./assets/images/badge.png')} />
            </TouchableOpacity>
            <Text style={styles.badgetTextWhite}>Slave-free</Text>
            <Text style={styles.badgetTextGray}>Unlocked</Text>
          </View>
          <View style={[styles.badge, { top: topRow, left: 135, } ]}>
            <TouchableOpacity onPress={() => { this.scroller.scrollTo({ x: 0 , y: 0 })}}>
              <Image style={styles.imageBadge} source={require('./assets/images/badge2.png')} />
            </TouchableOpacity>
            <Text style={styles.badgetTextWhite}>CO-2 Friendly</Text>
            <Text style={styles.badgetTextGray}>Unlocked</Text>
          </View>
          <View style={[styles.badge, { top: topRow, left: 260, opacity: 0.5 } ]}>
            <TouchableOpacity onPress={() => { this.scroller.scrollTo({ x: 0 , y: 0 })}}>
              <Image style={styles.imageBadge} source={require('./assets/images/badge.png')} />
              </TouchableOpacity>
            <Text style={styles.badgetTextWhite}>Recycled</Text>
            <Text style={styles.badgetTextGray}>Locked</Text>
          </View>
          {/* middle row */}     
          <View style={[styles.badge, { top: middleRow, left: 63, } ]}>
            <TouchableOpacity onPress={() => { this.scroller.scrollTo({ x: 0 , y: 0 })}}>
              <Image style={styles.imageBadge} source={require('./assets/images/badge4.png')} />
            </TouchableOpacity>
            <Text style={styles.badgetTextWhite}>Bio-degradable</Text>
            <Text style={styles.badgetTextGray}>Unlocked</Text>
          </View>
          <View style={[styles.badge, { top: middleRow, left: 198, } ]}>
            <TouchableOpacity onPress={() => { this.scroller.scrollTo({ x: 0 , y: 0 })}}>
              <Image style={styles.imageBadge} source={require('./assets/images/badge5.png')} />
            </TouchableOpacity>
            <Text style={styles.badgetTextWhite}>Fair Trade</Text>
            <Text style={styles.badgetTextGray}>Unlocked</Text>
          </View>          
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    height: 90,
    width: 85,
  },
  imageBadge: {
    height: 85,
    width: 85,
  },
  badgetTextWhite: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',  
  },
  badgetTextGray: {
    fontSize: 12,
    color: '#dedede',
    textAlign: 'center',  
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    fontFamily: 'Roboto',
  },
  logoContainer: {
    position: 'relative',
    backgroundColor: 'black',
    top: 0,
    height: 565,
  },
  logo: {
    width: '100%',
    marginTop: 50,
    height: 400,
  },
  tshirt: {
    height: 258 ,
    width: 360,
    top: 0,
  },
  productDetails: {
    top: 20,
    left: 10,
  },
  statusDetails: {
    top: 0,
    left: 10,
  },
  productIdDetails: {
    top: -40,
    left: 10,
  },
  subscript: {
    fontSize: 30,
    color: '#EFEFEF',
    textAlign: 'center',
    marginTop: 20,
    //fontWeight: 'bold',
  },
  badgesContainer: {
    position: 'relative',
    top: 0,
    backgroundColor: 'black',
    height: 565,
  },
  productDetailsContainer: {
    position: 'relative',
    top: 0,
    backgroundColor: 'black',
    height: 565,
  },

});
