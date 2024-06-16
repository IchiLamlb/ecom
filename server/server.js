const app = require("./src/app");

const PORT = process.env.PORT || 7000;

const server = app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error:`, err);
    console.log(`Shutting down the server for Handling uncaught Exception`);
});

process.on("unhandledRejection", (err) => {
    console.log(`Shutting down server for`, err);
    console.log(`Shutting down the server due to Unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    });
});
