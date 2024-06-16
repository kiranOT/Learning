import { data } from "../DoToData/DoToData"

export default function DoToMainPage() {
    return (
        <>
            <table border="1px">
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>City</th>
                </tr>

                {
                    data.length < 1 ? (<tr><td>Please Enter Data First</td></tr>) : (
                        data.map((detail) => {
                            return (
                                <tr>
                                    <td>{detail.id}</td>
                                    <td>{detail.name}</td>
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