const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


(async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/store')
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error: ", error);
    }
}
)();

const productRouter = require('./routes/index');
app.use('/', productRouter);

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})