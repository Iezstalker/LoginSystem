import "./App.css";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import About from "./Components/About";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Alert from "./Components/Alert";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Forget from './Components/Forget';
import { useState } from "react";

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };
  return (
    <>
      <div className="App">
          <BrowserRouter>
            <Navbar />
            <Alert alert={alert} />
            <>
              <Routes>
                <Route path="/" element={<Home showAlert={showAlert} />} />
                <Route path="About" element={<About />} />
                <Route path="/login" element={<Login showAlert={showAlert} />} />
                <Route path="/signup" element={<Signup showAlert={showAlert} />} />
                <Route path="/forget" element={<Forget showAlert={showAlert} />} />
              </Routes>
            </>
          </BrowserRouter>
      </div>
    </>
  );
}

export default App;
