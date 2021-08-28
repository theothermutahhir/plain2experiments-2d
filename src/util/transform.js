const hasPositionChanged = ({ pos, prevPos }) => pos !== prevPos;

const valueInRange = ({ minScale, maxScale, scale }) =>
  scale <= maxScale && scale >= minScale;

const getTranslate = ({ minScale, maxScale, scale }) => ({
  pos,
  prevPos,
  translate
}) =>
  valueInRange({ minScale, maxScale, scale }) &&
  hasPositionChanged({ pos, prevPos })
    ? translate + (pos - prevPos * scale) * (1 - 1 / scale)
    : translate;

const getMatrix = ({ scale, translateX, translateY }) =>
  `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;

const getScale = ({
  scale,
  minScale,
  maxScale,
  scaleSensitivity,
  deltaScale
}) => {
  let newScale = scale + deltaScale / (scaleSensitivity / scale);
  newScale = Math.max(minScale, Math.min(newScale, maxScale));
  return [scale, newScale];
};

const pan = ({ state, originX, originY }) => {
  state.transformation.translateX += originX;
  state.transformation.translateY += originY;
  if (!state.ref.current) return;
  console.log("TRans: ");
  state.ref.current.style.transform = getMatrix({
    scale: state.transformation.scale,
    translateX: state.transformation.translateX,
    translateY: state.transformation.translateY
  });
};

const canPan = (state) => ({
  panBy: ({ originX, originY }) => pan({ state, originX, originY }),
  panTo: ({ originX, originY, scale }) => {
    state.transformation.scale = scale;
    pan({
      state,
      originX: originX - state.transformation.translateX,
      originY: originY - state.transformation.translateY
    });
  }
});

const canZoom = (state) => ({
  zoom: ({ x, y, deltaScale }) => {
    const { left, top } = state.ref.current.getBoundingClientRect();
    const { minScale, maxScale, scaleSensitivity } = state;
    const [scale, newScale] = getScale({
      scale: state.transformation.scale,
      deltaScale,
      minScale,
      maxScale,
      scaleSensitivity
    });
    const originX = x - left;
    const originY = y - top;
    const newOriginX = originX / scale;
    const newOriginY = originY / scale;
    const translate = getTranslate({ scale, minScale, maxScale });
    const translateX = translate({
      pos: originX,
      prevPos: state.transformation.originX,
      translate: state.transformation.translateX
    });
    const translateY = translate({
      pos: originY,
      prevPos: state.transformation.originY,
      translate: state.transformation.translateY
    });

    state.ref.current.style.transformOrigin = `${newOriginX}px ${newOriginY}px`;
    state.ref.current.style.transform = getMatrix({
      scale: newScale,
      translateX,
      translateY
    });
    state.transformation = {
      originX: newOriginX,
      originY: newOriginY,
      translateX,
      translateY,
      scale: newScale
    };
  }
});

export const transformer = ({
  minScale,
  maxScale,
  ref,
  scaleSensitivity = 10
}) => {
  const state = {
    ref,
    minScale,
    maxScale,
    scaleSensitivity,
    transformation: {
      originX: 0,
      originY: 0,
      translateX: 0,
      translateY: 0,
      scale: 1
    }
  };
  return Object.assign({}, canZoom(state), canPan(state));
};

export const useTransformer = (
  { minScale = 0.001, maxScale = 1000, scaleSensitivity = 10 } = {
    minScale: 0.001,
    maxScale: 1000,
    scaleSensitivity: 10
  }
) => {
  const state = {
    minScale,
    maxScale,
    scaleSensitivity,
    transformation: {
      originX: 0,
      originY: 0,
      translateX: 0,
      translateY: 0,
      scale: 1
    }
  };

  return {
    getTransform: () => Object.assign({}, state.transformation),
    zoomTransform: (left, top, x, y, deltaScale) => {
      const { minScale, maxScale, scaleSensitivity } = state;
      const [scale, newScale] = getScale({
        scale: state.transformation.scale,
        deltaScale,
        minScale,
        maxScale,
        scaleSensitivity
      });
      const originX = x - left;
      const originY = y - top;
      const newOriginX = originX / scale;
      const newOriginY = originY / scale;
      const translate = getTranslate({ scale, minScale, maxScale });
      const translateX = translate({
        pos: originX,
        prevPos: state.transformation.originX,
        translate: state.transformation.translateX
      });
      const translateY = translate({
        pos: originY,
        prevPos: state.transformation.originY,
        translate: state.transformation.translateY
      });

      const finalOrigin = `${newOriginX}px ${newOriginY}px`;
      const finalTransform = getMatrix({
        scale: newScale,
        translateX,
        translateY
      });

      state.transformation = {
        originX: newOriginX,
        originY: newOriginY,
        translateX,
        translateY,
        scale: newScale
      };

      return {
        transformOrigin: finalOrigin,
        transform: finalTransform
      };
    },
    pan: ({ originX, originY }) => {
      state.transformation.translateX += originX;
      state.transformation.translateY += originY;

      console.log(state.transformation, originX, originY);
      return {
        transform: getMatrix({
          scale: state.transformation.scale,
          translateX: state.transformation.translateX,
          translateY: state.transformation.translateY
        })
      };
    }
  };
};
