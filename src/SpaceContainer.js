import { forwardRef, useReducer } from "react";
import SpaceItem from "./SpaceItem";
import { v4 as uuid } from "uuid";

const DEFAULT_ITEM_WIDTH = 300;
const DEFAULT_ITEM_HEIGHT = 400;

const newItem = ({ title, content, x, y }) => ({
  uuid: uuid(),
  title: title,
  content: content,
  isEditing: false,
  location: {
    x,
    y,
    height: 400,
    width: 300
  }
});

const reducer = (state, action) => {
  switch (action.type) {
    case "add-item":
      return {
        ...state,
        items: [...state.items, newItem(action.payload)]
      };
    case "stop-editing":
      return {
        ...state,
        items: state.items.map((item) => ({ ...item, isEditing: false }))
      };
    case "begin-editing":
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.uuid === action.uuid) {
            return { ...item, isEditing: true };
          }
          return item;
        })
      };
    default:
      throw new Error();
  }
};

function SpaceContainer({ space, transform }, ref) {
  const { items } = space;
  const [state, dispatch] = useReducer(reducer, { items });

  const onDoubleClick = (event) => {
    if (event.target !== ref.current) return;
    dispatch({
      type: "add-item",
      payload: {
        title: "Random",
        content: "Edit please...",
        x: event.pageX - DEFAULT_ITEM_WIDTH / 2,
        y: event.pageY - DEFAULT_ITEM_HEIGHT / 2
      }
    });
  };

  const onKeyUp = (event) => {
    if (event.keyCode === 27) {
      dispatch({ type: "stop-editing" });
    }
  };

  return (
    <div
      className="space-container"
      ref={ref}
      onDoubleClick={onDoubleClick}
      onKeyUp={onKeyUp}
    >
      {state.items.map((item) => (
        <SpaceItem
          item={item}
          key={item.uuid}
          transform={transform}
          onBeginEditing={() =>
            dispatch({ type: "begin-editing", uuid: item.uuid })
          }
        />
      ))}
    </div>
  );
}

export default forwardRef(SpaceContainer);
