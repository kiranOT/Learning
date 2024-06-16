import { Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import Employee from './Employee';

function Home() {
    let navigate = useNavigate();

    const Edit = (id, Name, age) => {
        localStorage.setItem('Name', Name)
        localStorage.setItem('age', age)
        localStorage.setItem('id', id)
    }

    const Delete = (id) => {
        var index = Employee.map(function (obj) {
            return obj.id;
        }).indexOf(id);
        Employee.splice(index, 1);

        navigate('/'); // Because Employee have not state Therefore we use navigation to refresh Data on page.
    }

    return (
        <>
            <div style={{ margin: "10rem" }}>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Action </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Employee && Employee.length > 0
                                ?
                                Employee.map((item) => {
                                    return (
                                        <tr>
                                            <td>{item.id} </td>
                                            <td> {item.Name}   </td>
                                            <td> {item.age}  </td>
                                            <td>
                                                <Button onClick={() => Delete(item.id)}>delete</Button>
                                                <Link to={'/Edit'}>  <Button onClick={() => Edit(item.id, item.Name, item.age)}>Edit</Button>  </Link>
                                            </td>
                                        </tr>
                                    )
                                }) : "No data available"
                        }
                    </tbody>
                </Table>
                <Link className="d-grid grid-2" to='/create'>
                    <Button size="Lg">Add</Button>
                </Link>

            </div>
        </>

    )
}
export default Home;