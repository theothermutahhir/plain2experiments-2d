import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";

const space = {
  zoom: 0.3,
  items: [
    {
      uuid: 1,
      title: "Hello",
      content: "world",
      isEditing: false,
      location: {
        x: 100,
        y: 100,
        height: 300,
        width: 400
      }
    },
    {
      uuid: 2,
      title: "Welcome to Plain 2",
      content: "This is the best thing for us?",
      isEditing: false,
      location: {
        x: 0,
        y: 0,
        height: 300,
        width: 400
      }
    }
  ]
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App space={space} />
  </StrictMode>,
  rootElement
);
