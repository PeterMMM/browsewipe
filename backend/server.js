import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authApiRoutes from './routes/auth.js';
import routesRoutes from './routes/userBroswer.js';
import emergencyActionApiRoutes from './routes/emergencyAction.js';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.set('view engine','ejs');
app.use(express.static('public'));

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true, parameterLimit: 1000000 }));
app.use(cors());

// Debugging middleware
/*app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
}); */

app.use('/api/auth/', authApiRoutes);
app.use('/api/check-emergency-action',emergencyActionApiRoutes);
app.use('/api/browsers',routesRoutes);

app.get('/', (req, res) => {
    const data = {
        title: 'Browsestrike',
        heading: 'Welcome to browsestrike!',
        username: 'Guest',
        features: ['Broswer Security', 'Wipe the data out', 'Save people']
    };
    res.render('index', data);
})

app.get('/about', (req, res) => {
    const data = {
        title: 'Browsestrike',
        heading: 'Welcome to browsestrike!',
        username: 'Guest',
        contributors: ['Peter(Developer)', 'Nyan(Data Engineer)'],
    };
    res.render('about', data);
})

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => app.listen(PORT, () => console.log(`Server Running on PORT: ${PORT}`)))
.catch((error) => console.log(`${error} did not connect`));
