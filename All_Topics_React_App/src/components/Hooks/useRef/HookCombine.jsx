import { useRef,useState } from "react"

export default function UseRefHook() {
    const [city,setCity] = useState("")
    const name = useRef("")
    const email = useRef("")
    const id = useRef("")

    function handleSubmit(e) {
        e.preventDefault()
        // console.log(name, city, email, id);
        console.log(name.current.value);
    }
    return (
        <>
            <form onSubmit={handleSubmit}>

                <label htmlFor="name">name</label>
                <br />
                <input type="text" name="name" ref={name} />
                <br />
                <label htmlFor="email">Email</label>
                <br />
                <input type="text" name="email" ref={email} />
                <br />
                <label htmlFor="city">City</label>
                <br />
                <input type="text" name="city" value={city} onChange={(e)=>{setCity(e.target.value)}} />
                <br />
                <label htmlFor="id">Id</label>
                <br />
                <input type="text" name="id" ref={id} />
                <br />
                <button type="submit">submit</button>
            </form>

            <div>
                Name: <p>{name.current.valueOf().value}</p>
               city:  <p>{city}</p>
            </div>
        </>
    )

}