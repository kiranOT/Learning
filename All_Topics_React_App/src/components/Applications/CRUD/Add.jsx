import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Employee from "./Employee";
import { v4 as uuid } from 'uuid';
import { useNavigate } from "react-router-dom";

function Add() {
    const navigate = useNavigate();
    const [Name, setName] = useState('');
    const [age, setAge] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = uuid();
        let uniqueId = id.slice(0, 8);
        Employee.push({ id: uniqueId, Name: Name, age: age });
        navigate("/");
    }

    return (
        <div>
            <Form className="d-grid gap-2" style={{ margin: "15rem" }} onSubmit={(e) => handleSubmit(e)} >
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Control type="text" placeholder="Enter Name" required autoComplete="off" onChange={(e) => setName(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formAge">
                    <Form.Control type="text" placeholder="Enter Age" required autoComplete="off" onChange={(e) => setAge(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                <Button type="submit" >submit</Button>
            </Form>
        </div >
    )
}
export default Add;