const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
const cors = require('cors')

 
app.use(cors());

// port
const port = 3000 || process.env.PORT ;

// public file
app.use(express.static(path.join(__dirname, 'public')));

// express-handlebars
const hbs = exphbs.create({
    extname: 'hbs',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './src/views');

// Middleware: read body of post method
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'));

// router
const route = require('./routes');
route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
