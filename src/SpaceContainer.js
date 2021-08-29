import { forwardRef } from "react";
import SpaceItem from "./SpaceItem";

function SpaceContainer({ space, transform }, ref) {
  const { items } = space;
  return (
    <div className="space-container" ref={ref}>
      {items.map((item) => (
        <SpaceItem item={item} key={item.uuid} transform={transform} />
      ))}
    </div>
  );
}

export default forwardRef(SpaceContainer);
