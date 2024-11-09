const viewportPadding = 8;
export const limitDomInViewPort = (rect: { left: number; top: number; width: number; height: number }) => {
  let { left, top, width, height } = rect;
  const { clientWidth, clientHeight } = document.documentElement;
  let leftLimited = false;
  let topLimited = false;
  if (left + width > clientWidth) {
    left = clientWidth - width - viewportPadding;
    leftLimited = true;
  }
  else if (left < 0) {
    left = viewportPadding;
    leftLimited = true;
  }
  if (top + height > clientHeight) {
    top = clientHeight - height - viewportPadding;
    topLimited = true;
  }
  else if (top < 0) {
    top = viewportPadding;
    topLimited = true;
  }
  return {
    left,
    top,
    leftLimited,
    topLimited,
  };
};
