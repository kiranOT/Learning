import { useEffect, useState } from "react"
const PasswordGenerator = () => {
    const [password, SetPassword] = useState("")
    const [length, SetLength] = useState(8)
    const [isSpecial, SetIsSpecial] = useState(false)
    const [isNumber, SetIsNumber] = useState(false)
    useEffect(() => {
        let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", NewPassword = ""
        if (isSpecial)
            str += "!@#$%^&*()-=_+[]{}|;:',.<>/?"
        if (isNumber)
            str += "1234567890"

        for (let i = 0; i < length; i++) {
            NewPassword += str[Math.floor(Math.random() * str.length)]
        }
        SetPassword(NewPassword)
    }, [length, isSpecial, isNumber])
    
    return (
        <div>
            <center>
                <h1>PasswordGenerator</h1>
                <br />
            </center>
            <div>
                <form className="flex items-center flex-column">
                    <div>
                        <h4>Password : {password}</h4>
                    </div>
                    <br />
                    <br />
                    <div>

                        Range :   <input type="range" min={1} max={30} value={length} onChange={(e) => {
                            SetLength(e.target.value)
                        }} /> :{length}
                    </div>
                    <br />
                    <div>
                        Number : <input type="checkbox" onChange={() => {
                            SetIsNumber((prev) => !prev)
                        }} />
                    </div>
                    <br />
                    <div>
                        SpecialChar : <input type="checkbox" onChange={() => {
                            SetIsSpecial((prev) => !prev)
                        }} />
                    </div>
                </form>
            </div>
        </div>
    )
}


export default PasswordGenerator