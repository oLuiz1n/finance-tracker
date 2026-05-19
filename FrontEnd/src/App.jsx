import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import History from "../pages/History.jsx"

function App() {
  return(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/History" element={<History/>}/>
        </Routes>
    </BrowserRouter>
  );
};

export default App;