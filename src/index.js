import app from "./app.js";

const PORT = process.env.PORT || 4001;

app.get("/", (req, res) => {
    const htmlResponse = '<html><head><title>Flex-Backend</title></head><body>FUNCOOOO, VAMO BOCAAA</body></html>';
    res.send(htmlResponse);
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en: http://localhost:${PORT}`);
});