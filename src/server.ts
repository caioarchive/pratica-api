import app from "./app";

const PORT = 3333

app.listen(PORT, ()=>{
    console.log(`Servidor iniciado em http://localhost:${PORT}/api/`)
})