import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"


export const LoginPage = () => {
    const navigate = useNavigate()
    
    const [formBool, setFormBool] = useState(true)

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    
    const [name1, setName1] = useState("")
    const [password1, setPassword1] = useState("")

    return (
        <>
            <div className='flex justify-between'> <button onClick={() => {
                setFormBool(true)
            }}>sign Up</button>

                <button onClick={() => {
                    setFormBool(false)
                }}>log in</button></div>

            <div>


                {
                    formBool ? < form onSubmit={(e) => {
                        e.preventDefault()
                        if (password === confirmPassword) {
                            localStorage.setItem("cred", JSON.stringify({ name, password }))
                            setFormBool(false)
                        }
                        else
                            alert("Password not matched..")
                    }}>

                        <center><h4>SignUp page</h4></center>
                        <label htmlFor="useName">User name</label>
                        <br />
                        <input autoComplete="false" type="text" onChange={(e) => { setName(e.target.value) }} />
                        <br /><br />
                        <label htmlFor="password">Password</label>
                        <br />
                        <input autoComplete="false" type="password" onChange={(e) => { setPassword(e.target.value) }} />
                        <br /><br />
                        <label htmlFor="confirmPassword">confirm Password</label>
                        <br />
                        <input autoComplete="false" type="password" onChange={(e) => { setConfirmPassword(e.target.value) }} />
                        <br /><br />

                        <button type='submit'>Create Account</button>

                    </form> : < form onSubmit={(e) => {
                        e.preventDefault()

                        let { name, password } = JSON.parse(localStorage.getItem("cred"))
                        if (name == name1 && password == password1) {
                            navigate("successpage")
                        }
                        else {
                            alert("Cred not matched.. ")
                        }
                    }}>
                        <center><h4>login page</h4></center>
                        <label htmlFor="useName1">User name</label>
                        <br />
                        <input autoComplete="false" type="text" onChange={(e) => { setName1(e.target.value) }} />
                        <br /><br />
                        <label htmlFor="password1">Password</label>
                        <br />
                        <input autoComplete="false" type="password" onChange={(e) => { setPassword1(e.target.value) }} />
                        {password1}
                        <br /><br />

                        <button type='submit'>Log in</button>

                    </form>
                }

            </div >

        </>
    )
}
