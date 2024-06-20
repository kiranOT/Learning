fetch("http://localhost:8080", {
  method: "POST",
  headers: { "Content-type": "application/json" },
  body: JSON.stringify({ name: "krishna", salary: 20000000000 }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  })
  .catch((er) => console.log(er));
