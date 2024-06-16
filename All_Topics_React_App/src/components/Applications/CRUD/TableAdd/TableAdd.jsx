import { useState } from "react";
import "./TableAdd.css";

function TableAdd() {
    const [inputArr, setInputArr] = useState([]);

    const [inputData, SetInputData] = useState({ name: "", rollNo: "" });

    function changeHandle(e) {
        SetInputData({ ...inputData, [e.target.name]: e.target.value });
    }

    let { name, rollNo } = inputData;
    function changHandle() {
        setInputArr([...inputArr, { name, rollNo }]);
        console.log(inputData, "input data what we Enter");
        SetInputData({ name: "", rollNo: "" });
    }
    let deleteHandle = (i) => {
        let newDataArr = [...inputArr];
        newDataArr.splice(i, 1);
        setInputArr(newDataArr);
    };
    function changHandle2() {
        console.log("Object store in array", inputArr);

        fetch("https://jsonplaceholder.typicode.com/users", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputData),
        }).then((resp) => {
            resp.JSON().then((result) => {
                console.log("result", result);
            });
        });
    }
    return (
        <div className="App">
            <input
                type="text"
                autoComplete="off"
                name="name"
                value={inputData.name}
                onChange={changeHandle}
                placeholder="Enter Name"
            />
            <input
                type="text"
                autoComplete="off"
                name="rollNo"
                value={inputData.rollNo}
                onChange={changeHandle}
                placeholder="Roll no"
            />

            <button onClick={changHandle}>Add It</button>
            <br />
            <button onClick={changHandle2}>Check Array in console</button>
            <br />
            <br />

            <table border={1} width="30%" cellPadding={10}>
                <tbody>
                    <tr>
                        <td>Sr.No</td>
                        <th>Name </th>
                        <th>Roll No</th>
                        <th>Options</th>
                    </tr>
                    {inputArr.length < 1 ? (
                        <tr>
                            <td colSpan={4}>NO data Enter yet !</td>
                        </tr>
                    ) : (
                        inputArr.map((info, ind) => {
                            return (
                                <tr key={ind}>
                                    <td>{ind + 1}</td>
                                    <td>{info.name}</td>
                                    <td>{info.rollNo}</td>
                                    <td>
                                        <button onClick={() => deleteHandle(ind)}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TableAdd;