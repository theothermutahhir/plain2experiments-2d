import SpaceViewport from "./SpaceViewport";
import "./styles.css";

export default function App({ space }) {
  return (
    <div className="App">
      <SpaceViewport space={space} />
      <div id="data-info"></div>
      <div id="transform-point"></div>
    </div>
  );
}
