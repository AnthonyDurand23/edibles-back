require(`dotenv`).config();
const express = require(`express`);
const cors = require(`cors`);
const router = require(`./app/router`);
const options = require(`./doc/swagger`);

const app = express();

const expressSwagger = require(`express-swagger-generator`)(app);

const port = process.env.PORT || 3030;

expressSwagger(options);

app.use(express.urlencoded({extended: true}));

const corsOptions = {
    exposedHeaders: `Authorization`,
};
  
app.use(cors(corsOptions));

app.use(express.json());

app.use(router);

app.use((_, response) => response.status(404).json(`Not found`));

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});