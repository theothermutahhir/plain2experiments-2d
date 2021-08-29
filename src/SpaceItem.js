import { useEffect, useRef, useState } from "react";
import { Editor } from "./Editor";

export default function SpaceItem({ item, transform, onBeginEditing }) {
  const itemRef = useRef();
  const { uuid, location: originalLocation, title, content } = item;
  const [location, setLocation] = useState(originalLocation);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (itemRef.current) {
      itemRef.current.style.transform = `translate(${location.x}px, ${location.y}px)`;
    }
  }, [itemRef, location, transform]);

  const onMouseMove = (event) => {
    if (pressed) {
      setLocation({
        x: location.x + event.movementX / transform.scale,
        y: location.y + event.movementY / transform.scale,
        width: location.width,
        height: location.height
      });
    }
  };

  const onMouseDown = (event) => {
    if (item.isEditing) {
      return;
    }
    setPressed(true);
  };

  const onMouseUp = (event) => {
    setPressed(false);
  };

  const onMouseLeave = (event) => {
    if (pressed) {
      setPressed(false);
    }
  };

  return (
    <div
      ref={itemRef}
      className={`item ${pressed ? "dragging" : ""}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onDoubleClick={() => onBeginEditing()}
      key={uuid}
      style={{
        minHeight: location.height,
        width: location.width
      }}
    >
      <h1>{title}</h1>
      <Editor content={content} isEditing={item.isEditing} />
    </div>
  );
}
