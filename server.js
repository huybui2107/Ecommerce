const app = require("./src/app");
const PORT =process.env.PORT || 3050;
const server = app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`)
})

process.on('SIGINT',()=>{
    server.close(()=>{
        console.log('Server closed')
    })
})