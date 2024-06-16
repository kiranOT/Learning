import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Employee from "./Employee"
import { useNavigate } from "react-router-dom";

function Edit() {
    const [Name, setName] = useState('');
    const [age, setAge] = useState('');
    const [id, setId] = useState('');

    let history = useNavigate();

    var index = Employee.map(function (e) {
        return e.id;
    }).indexOf(id);

    const handleSubmit = (e) => {
        e.preventDefault();
        let obj = Employee[index];
        obj.Name = Name;
        obj.age = age;
        history("/");
    }

    useEffect(() => {
        setName(localStorage.getItem('Name'))
        setAge(localStorage.getItem('age'))
        setId(localStorage.getItem('id'))
    }, [])

    return (
        <div>
            <Form className="d-grid gap-2" style={{ margin: "15rem" }} onSubmit={(e) => handleSubmit(e)}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Control type="text" value={Name} required autoComplete="off" onChange={(e) => setName(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formAge">
                    <Form.Control type="text" value={age} required autoComplete="off" onChange={(e) => setAge(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                <Button type="submit" >submit</Button>
            </Form>
        </div>
    )
}
export default Edit;