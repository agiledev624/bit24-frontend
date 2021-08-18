/**
 * Calculate the position of tooltip
 *
 * @params
 * - `e` {Event} the event of current mouse
 * - `target` {Element} the currentTarget of the event
 * - `node` {DOM} the react-tooltip object
 * - `place` {String} top / right / bottom / left
 * - `effect` {String} float / solid
 * - `offset` {Object} the offset to default position
 *
 * @return {Object}
 * - `isNewState` {Bool} required
 * - `newState` {Object}
 * - `position` {Object} {left: {Number}, top: {Number}}
 */
interface Position {
  left: number;
  top: number;
}

type AlignContent = "left" | "right" | "center";

export function getPosition(
  e,
  target,
  node,
  place: any = "bottom",
  desiredPlace: any = "bottom",
  align: AlignContent = "center",
  effect: any = "solid",
  offset: any = {},
  newState: boolean = false
): {
  isNewState?: boolean;
  newState?: { place: string };
  position?: Position;
} {
  const { width: tipWidth, height: tipHeight } = getDimensions(node);

  const { width: targetWidth, height: targetHeight } = getDimensions(target);

  // const { mouseX, mouseY } = getCurrentOffset(e, target, effect);
  const { x: mouseX, y: mouseY } = getRelativeCoordinates(e, node);

  const defaultOffset = getDefaultPosition(
    effect,
    targetWidth,
    targetHeight,
    tipWidth,
    tipHeight,
    align
  );
  const { extraOffsetX, extraOffsetY } = calculateOffset(offset);

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const { parentTop, parentLeft } = getParent(node);

  // Get the edge offset of the tooltip
  const getTipOffsetLeft = (place) => {
    const offsetX = defaultOffset[place].l;
    return mouseX + offsetX + extraOffsetX;
  };
  const getTipOffsetRight = (place) => {
    const offsetX = defaultOffset[place].r;
    return mouseX + offsetX + extraOffsetX;
  };
  const getTipOffsetTop = (place) => {
    const offsetY = defaultOffset[place].t;
    return mouseY + offsetY + extraOffsetY;
  };
  const getTipOffsetBottom = (place) => {
    const offsetY = defaultOffset[place].b;
    return mouseY + offsetY + extraOffsetY;
  };

  //
  // Functions to test whether the tooltip's sides are inside
  // the client window for a given orientation p
  //
  //  _____________
  // |             | <-- Right side
  // | p = 'left'  |\
  // |             |/  |\
  // |_____________|   |_\  <-- Mouse
  //      / \           |
  //       |
  //       |
  //  Bottom side
  //
  const outsideLeft = (p) => getTipOffsetLeft(p) < 0;
  const outsideRight = (p) => getTipOffsetRight(p) > windowWidth;
  const outsideTop = (p) => getTipOffsetTop(p) < 0;
  const outsideBottom = (p) => getTipOffsetBottom(p) > windowHeight;

  // Check whether the tooltip with orientation p is completely inside the client window
  const outside = (p) =>
    outsideLeft(p) || outsideRight(p) || outsideTop(p) || outsideBottom(p);
  const inside = (p) => !outside(p);

  const placesList = ["top", "bottom", "left", "right", "bottom-right"];
  const insideList = [];
  for (let i = 0; i < 4; i++) {
    const p = placesList[i];
    if (inside(p)) {
      insideList.push(p);
    }
  }

  let isNewState = false;
  let newPlace;
  const shouldUpdatePlace = desiredPlace !== place;
  if (inside(desiredPlace) && shouldUpdatePlace) {
    isNewState = true;
    newPlace = desiredPlace;
  } else if (insideList.length > 0 && outside(desiredPlace) && outside(place)) {
    isNewState = true;
    newPlace = insideList[0];
  }

  if (isNewState) {
    // return {
    //   isNewState: true,
    //   newState: { place: newPlace }
    // };
    return getPosition(
      e,
      target,
      node,
      newPlace,
      newPlace,
      effect,
      offset,
      isNewState
    );
  }

  return {
    isNewState: isNewState || newState,
    newState: { place: newPlace || desiredPlace },
    position: {
      //@ts-ignore
      left: parseInt(getTipOffsetLeft(place) - parentLeft, 10),
      //@ts-ignore
      top: parseInt(getTipOffsetTop(place) - parentTop, 10),
    },
  };
}

const getDimensions = (node) => {
  const { height, width } = node.getBoundingClientRect();

  return {
    height: parseInt(height, 10),
    width: parseInt(width, 10),
  };
};

// Get current mouse offset
const getCurrentOffset = (e, currentTarget, effect) => {
  const boundingClientRect = currentTarget.getBoundingClientRect();
  const targetTop = boundingClientRect.top;
  const targetLeft = boundingClientRect.left;
  const { width: targetWidth, height: targetHeight } =
    getDimensions(currentTarget);

  if (effect === "float") {
    return {
      mouseX: e.clientX,
      mouseY: e.clientY,
    };
  }
  return {
    mouseX: targetLeft + targetWidth / 2,
    mouseY: targetTop + targetHeight / 2,
  };
};
export function getRelativeCoordinates(
  event: MouseEvent,
  referenceElement: any
) {
  const position = {
    x: event.pageX,
    y: event.pageY,
  };

  const offset = {
    left: referenceElement.offsetLeft,
    top: referenceElement.offsetTop,
  };

  let reference = referenceElement.offsetParent;

  while (reference) {
    offset.left += reference.offsetLeft;
    offset.top += reference.offsetTop;
    reference = reference.offsetParent;
  }

  return {
    x: position.x - offset.left,
    y: position.y - offset.top,
  };
}

// List all possibility of popup final offset
// This is useful in judging if it is necessary for tooltip to switch position when out of window
const getDefaultPosition = (
  effect,
  targetWidth: number,
  targetHeight: number,
  contentWidth: number,
  contentHeight: number,
  align: AlignContent
) => {
  const triangleHeight = 2;

  const top = {
    l: -(contentWidth / 2),
    r: contentWidth / 2,
    t: -(targetHeight / 2 + contentHeight + triangleHeight),
    b: -(targetHeight / 2),
  };

  let bottom = {
    l: -(contentWidth / 2),
    r: contentWidth / 2,
    t: targetHeight / 2,
    b: targetHeight / 2 + contentHeight + triangleHeight,
  };

  if (align === "right") {
    bottom = {
      ...bottom,
      l: -(contentWidth - targetWidth / 2),
    };
  }

  const left = {
    l: -(contentWidth + targetWidth / 2 + triangleHeight),
    r: -(targetWidth / 2),
    t: -(contentHeight / 2),
    b: contentHeight / 2,
  };
  const right = {
    l: targetWidth / 2,
    r: contentWidth + targetWidth / 2 + triangleHeight,
    t: -(contentHeight / 2),
    b: contentHeight / 2,
  };

  return { top, bottom, left, right };
};

// Consider additional offset into position calculation
const calculateOffset = (offset) => {
  let extraOffsetX = 0;
  let extraOffsetY = 0;

  if (Object.prototype.toString.apply(offset) === "[object String]") {
    offset = JSON.parse(offset.toString().replace(/'/g, '"'));
  }
  for (const key in offset) {
    if (key === "top") {
      extraOffsetY -= parseInt(offset[key], 10);
    } else if (key === "bottom") {
      extraOffsetY += parseInt(offset[key], 10);
    } else if (key === "left") {
      extraOffsetX -= parseInt(offset[key], 10);
    } else if (key === "right") {
      extraOffsetX += parseInt(offset[key], 10);
    }
  }

  return { extraOffsetX, extraOffsetY };
};

// Get the offset of the parent elements
const getParent = (currentTarget) => {
  let currentParent = currentTarget;
  while (currentParent) {
    const computedStyle = window.getComputedStyle(currentParent);
    // transform and will-change: transform change the containing block
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_Block
    if (
      computedStyle.getPropertyValue("transform") !== "none" ||
      computedStyle.getPropertyValue("will-change") === "transform"
    )
      break;
    currentParent = currentParent.parentElement;
  }

  const parentTop =
    (currentParent && currentParent.getBoundingClientRect().top) || 0;
  const parentLeft =
    (currentParent && currentParent.getBoundingClientRect().left) || 0;

  return { parentTop, parentLeft };
};
