import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      let res = await axios.post(
        "http://localhost:8000/api/payment/checkout",
        {}
      );
    };
    fetchData();
  }, []);

  return <div className="App"></div>;
}

export default App;
