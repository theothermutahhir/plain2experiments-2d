import { useEffect, useRef, useState } from "react";

export default function SpaceItem({ item, transform }) {
  const itemRef = useRef();
  const { uuid, location: originalLocation, title, content } = item;
  const [location, setLocation] = useState(originalLocation);
  const [pressed, setPressed] = useState(false);
  const [offset, setOffset] = useState([0, 0]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (itemRef.current) {
      itemRef.current.style.transform = `translate(${location.x}px, ${location.y}px)`;
    }
  }, [itemRef, location]);

  const onMouseMove = (event) => {
    if (pressed) {
      setLocation({
        x: event.clientX - offset[0],
        y: event.clientY - offset[1],
        width: location.width,
        height: location.height
      });
    }
  };

  const onMouseDown = (event) => {
    const bounds = itemRef.current.getBoundingClientRect();
    setOffset([event.clientX - bounds.left, event.clientY - bounds.top]);
    setPressed(true);
    setIsDragging(true);
  };

  const onMouseUp = (event) => {
    document.removeEventListener("mousemove", onMouseMove);
    setOffset([0, 0]);
    setPressed(false);
    if (isDragging) {
      itemRef.current.style.zIndex = 1;
      setIsDragging(false);
    }
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
      key={uuid}
      style={{
        height: location.height,
        width: location.width
      }}
    >
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
}
