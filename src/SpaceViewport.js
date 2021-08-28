import { useEffect, useRef, useState } from "react";
import SpaceContainer from "./SpaceContainer";
import { useTransformer } from "./util/transform";

export default function SpaceViewport({ space }) {
  const transformer = useRef(useTransformer());
  const ref = useRef();
  const [currentTransform, setCurrentTransform] = useState({});

  const zoomHandler = (event) => {
    const isZoom = !!event.ctrlKey;

    const keys = ["clientX", "clientY", "deltaX", "deltaY", "pageX", "pageY"];

    document.getElementById("data-info").innerHTML = `<ul>${keys
      .map((key) => `<li><b>${key}</b>: <span>${event[key]}</span></li>`)
      .join("\n")}</ul><br /><pre>${JSON.stringify(
      transformer.current.getTransform(),
      null,
      2
    )}`;

    if (isZoom) {
      const boundingRect = ref.current.getBoundingClientRect();
      const zoomedTransforms = transformer.current.zoomTransform(
        boundingRect.left,
        boundingRect.top,
        event.pageX,
        event.pageY,
        Math.sign(event.deltaY) > 0 ? -1 : 1
      );

      let origin = zoomedTransforms.transformOrigin
        .split(" ")
        .map((v) => parseFloat(v));
      // .map((m) => m / transformer.current.getTransform().scale);
      document.getElementById("transform-point").style.left = origin[0] + "px";
      document.getElementById("transform-point").style.top = origin[1] + "px";

      ref.current.style.transformOrigin = zoomedTransforms.transformOrigin;
      ref.current.style.transform = zoomedTransforms.transform;
    } else {
      const pannedTransform = transformer.current.pan({
        originX: -event.deltaX * 2.01,
        originY: -event.deltaY * 2.01
      });

      ref.current.style.transform = pannedTransform.transform;
    }

    setCurrentTransform(transformer.current.getTransform());
  };

  const preventDefaultHandler = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    window.addEventListener("wheel", preventDefaultHandler, { passive: false });
    return () => {
      window.removeEventListener("wheel", preventDefaultHandler, {
        passive: false
      });
    };
  }, []);

  return (
    <div
      className="space-viewport"
      onWheel={zoomHandler}
      onTouchStart={zoomHandler}
      onTouchMove={zoomHandler}
      style={{
        touchAction: "none"
      }}
    >
      <SpaceContainer space={space} ref={ref} transform={currentTransform} />
    </div>
  );
}
