const styles = {
  itemContainer: {
    position: 'absolute',
  },
  itemImage: {
    flex: 1,
  },
  touchableContainer: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    resizeMode: 'stretch',
  },
  itemTitleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 25,
    zIndex: 1,
  },
  itemTitle: {
    backgroundColor: 'transparent',
    fontWeight: '600',
    fontSize: 28,
    lineHeight: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  itemSubtitle: {
    backgroundColor: 'transparent',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 18,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingBottom: 15,
    paddingTop: 15,
    flexDirection: 'row',
    zIndex: 1,
    elevation: 1,
  },
  navigationItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    height: 6,
    width: 6,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 3,
  },
  navigationItemSquares: {
    borderRadius: 0,
    height: 8,
    width: 8,
    marginLeft: 6,
    marginRight: 6,
  },
  navigationItemBars: {
    borderRadius: 0,
    height: 2,
    width: 20,
  }
};

export default styles;
