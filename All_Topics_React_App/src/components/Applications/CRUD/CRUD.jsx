import Home from "./Home";
import Add from "./Add"
import Edit from "./Edit";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CRUD = () => {
    return (

        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<Add />} />
                    <Route path="/edit" element={<Edit />} />
                </Routes>
            </Router>

        </>
    )
};

export default CRUD;