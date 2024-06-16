import { useState } from "react"

export default function FormMainPage() {

    const [name, SetName] = useState("")
    const [email, SetEmail] = useState("")
    const [password, SetPassword] = useState("")
    const [city, SetCity] = useState("")
    const [formDta, SetFOrmData] = useState([])


    return (
        <>
            <form className="border-2 m-2" onSubmit={(e) => {
                e.preventDefault();
                SetFOrmData((formDta) => [...formDta, { name: name, email: email, password: password, city: city }])
            }}>
                Name:
                <br />
                <input type="text" className="bg-orange-300 rounded-sm" value={name} onChange={(e) => { SetName(e.target.value) }} required />
                <br />
                Email:
                <br />
                <input type="email" className="bg-orange-300 rounded-sm" value={email} onChange={(e) => { SetEmail(e.target.value) }} required />
                <br />
                Password:
                <br />
                <input type="password" className="bg-orange-300 rounded-sm" value={password} onChange={(e) => { SetPassword(e.target.value) }} required />
                <br />
                City:
                <br />
                <input type="text" className="bg-orange-300 rounded-sm" value={city} onChange={(e) => { SetCity(e.target.value) }} required />
                <br />
                <center>
                    <button type="submit"
                        className="bg-blue-200  rounded-md mt-2"
                    >Add User</button>
                </center>
                {console.log(formDta)}
            </form>

            {console.log(formDta)}
            <table className="border-2 m-2 w-43">
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>City</th>
                </tr>

                {
                    formDta.length < 1 ? (<tr><td colSpan={4}>Please Enter Data First</td></tr>) : (
                        formDta.map((detail, index) => {
                            return (
                                <tr key={index} >
                                    <td >{index + 1}</td>
                                    <td>{detail.name}</td>
                                    <td>{detail.email}</td>
                                    <td>{detail.city}</td>
                                </tr>
                            )
                        })
                    )
                }

            </table>
        </>
    )
}