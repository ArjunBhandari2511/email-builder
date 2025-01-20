import { BrowserRouter as Router , Routes ,Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EmailEditor from "./components/EmailEditor";
import "./App.css";

function App () {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<EmailEditor />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;