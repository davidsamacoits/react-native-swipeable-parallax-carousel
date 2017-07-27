import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import styles from './styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

class SwipeableParallaxCarousel extends Component {
  static defaultProps = {
    height: 200,
    navigationColor: '#ffffff',
  }

  // Class constructor
  //
  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (event, gesture) => {
         return Math.abs(gesture.dx) > 5;
      },
      onPanResponderGrant: () => {
        // Deactivate parent scrollview
        if (this.props.parentScrollViewRef) this.props.parentScrollViewRef.setNativeProps({ scrollEnabled: false });
      },
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          // Can't swipe if it's the beginning
          if (this.state.currentItem === 0) {
            this._resetPosition();
          } else this._forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Can't swipe if it's the end
          if (this.state.currentItem === this.props.data.length - 1) {
            this._resetPosition();
          } else this._forceSwipe('left');
        } else {
          this._resetPosition();
        }
        // Reactivate parent scrollview
        if (this.props.parentScrollViewRef) this.props.parentScrollViewRef.setNativeProps({ scrollEnabled: true });
      }
    });
    this.panResponder = panResponder;
    this.position = position;

    this.state = {
      currentItem: 0,
      nextItem: 0,
    };
  }

  // Force swipe
  //
  _forceSwipe(direction) {
    const distance = (direction === 'right') ? SCREEN_WIDTH : -SCREEN_WIDTH;
    // Calculate nextItem
    const currentitem = this.state.currentItem;
    const newitem = (direction === 'right') ? currentitem - 1 : currentitem + 1;
    this.setState({ nextItem: newitem });
    Animated.spring(this.position, {
      toValue: { x: distance, y: 0 },
    }).start(() => this._onSwipeComplete(direction, newitem));
  }

  // on SwipeComplete
  //
  _onSwipeComplete(direction, newitem) {
    this.position.setValue({ x: 0, y: 0 });
    this.setState({ currentItem: newitem });
  }

  // Reset position
  //
  _resetPosition() {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  // Get overlay
  //
  _getOverlay(overlayPath, height) {
    if (overlayPath) return <Image source={overlayPath} style={[styles.overlay, { height }]} />;
    return null;
  }

  // Get title
  //
  _getTitle(item, titleColor) {
    if (item.title) {
      return (
        <View style={[styles.itemTitleContainer, this._getTitleAlign(), this._getTitlePadding()]}>
          <Text style={[styles.itemTitle, { color: titleColor }]}>{item.title}</Text>
          {item.subtitle &&
          <Text style={[styles.itemSubtitle, { color: titleColor }]}>{item.subtitle}</Text>
          }
        </View>
      );
    }
    return null;
  }

  // Get title alignement
  //
  _getTitleAlign() {
    if (this.props.align === 'center') return { alignItems: 'center' };
    if (this.props.align === 'right') return { alignItems: 'flex-end' };
    return { alignItems: 'flex-start' };
  }

  // Get title padding (if navigation active)
  //
  _getTitlePadding() {
    if (this.props.navigation) return { paddingBottom: 40 };
    return null;
  }

  // Get style for each individual item
  //
  _getItemStyle(index) {
    const { position } = this;
    // Current item zIndex (for parallax effect)
    const zIndex = (index === this.state.currentItem) ? 0 : 1;
    // Default margin based on the item position
    const defaultmargin = ((index - this.state.currentItem) * SCREEN_WIDTH);
    let deltaleft = SCREEN_WIDTH;
    if (this.props.parallax && index === this.state.currentItem) deltaleft = SCREEN_WIDTH / 4;
    if (!this.props.parallax && this.state.currentItem === this.props.data.length - 1) deltaleft = SCREEN_WIDTH / 4;
    let deltaright = SCREEN_WIDTH;
    if (this.props.parallax && index === this.state.currentItem) deltaright = SCREEN_WIDTH / 4;
    if (!this.props.parallax && this.state.currentItem === 0) deltaright = SCREEN_WIDTH / 4;
    const margin = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: [defaultmargin - deltaleft, defaultmargin, defaultmargin + deltaright],
    });
    return { left: margin, zIndex, elevation: zIndex };
  }

  // Render items method
  //
  _renderItems() {
    const {
      data,
      height,
      overlayPath,
      titleColor,
      onPress
    } = this.props;
    return data.map((item, index) => {
      return (
        <Animated.View
          key={item.id}
          {...this.panResponder.panHandlers}
          style={[styles.itemContainer, { height }, this._getItemStyle(index)]}
        >
          <TouchableOpacity
            onPress={() => onPress(item.id)}
            style={styles.touchableContainer}
            activeOpacity={0.98}
          >
            <ImageBackground
              source={{ uri: item.imagePath }}
              style={styles.itemImage}
            >
              {this._getOverlay(overlayPath, height)}
              {this._getTitle(item, titleColor)}
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>
      );
    });
  }

  // Render navigation
  //
  _renderNavigation() {
    const {
      navigation,
    } = this.props;
    if (navigation) {
      return (
        <View style={styles.navigationContainer}>
          {this._renderNavigationItems()}
        </View>
      );
    }
    return null;
  }

  // Render navigation item
  //
  _renderNavigationItems() {
    const {
      data,
      navigationColor,
      navigationType
    } = this.props;
    // Type of item (dots == default, bars, squares)
    let typeItem = null;
    if (navigationType === 'bars') typeItem = styles.navigationItemBars;
    if (navigationType === 'squares') typeItem = styles.navigationItemSquares;

    return data.map((item, index) => {
      // Current item selection
      let currentItem = null;
      if (index === this.state.nextItem) currentItem = { backgroundColor: navigationColor, transform: [{ scale: 1.25 }] };
      return (
        <Animated.View
          key={index}
          style={[styles.navigationItem, typeItem, currentItem]}
        />
      );
    });
  }

  // Render method
  //
  render() {
    return (
      <View style={[styles.carrouselContainer, { height: this.props.height }]}>
        {this._renderItems()}
        {this._renderNavigation()}
      </View>
    );
  }
}

export default SwipeableParallaxCarousel;
