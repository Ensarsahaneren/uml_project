import "./styles/App.scss";
import Home from "./page";
import Provider from "./store";

function App() {
  return (
    <Provider>
      <div className="App">
        <Home />
      </div>
    </Provider>
  );
}

export default App;
