import Header from "./components/Header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import TableComponent from "./pages/Table/Table";
import FormComponent from "./pages/Form/Form";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<TableComponent />} />
        <Route path="/form" element={<FormComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
