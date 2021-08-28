import { forwardRef } from "react";
import SpaceItem from "./SpaceItem";

function SpaceContainer({ space, transformStyles }, ref) {
  const { items } = space;
  return (
    <div className="space-container" ref={ref}>
      {items.map((item) => (
        <SpaceItem item={item} key={item.uuid} scale={1} />
      ))}
    </div>
  );
}

export default forwardRef(SpaceContainer);
