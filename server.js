const app = require("./app");



const port= process.env.PORT || 3000;




const server=app.listen(port, () => {
    console.log(`App running on port ${port}`)
});

// handle error outside express
process.on("unhandledRejection", (err) => {
    console.error(`unhandledRejection error: ${err.name} | ${err.message}`);
    // you must close server first then shut down your app
    server.close(() => {
        console.log(`App shutting down`)
        process.exit(1)
    })
});
