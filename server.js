require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIES = require('./movies.json');
const { response } = require('express');

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req,res,next) {
    console.log('validate bearer token middleware')

    const bearerToken=req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    if(bearerToken !== apiToken){
        return res.status(401).json({error: 'Unauthorized request'})
    }

    //move to the next middleware
    next()
});

function handleGetMovie(req,res){
    let response = MOVIES

    //check genre first
    if(req.query.genre){
        response = MOVIES.filter(movie => 
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()) 
        )
    }

    //check country next
    if(req.query.country){
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    //check average vote
    if(req.query.avg_vote){
        response = response.filter(movie => 
            movie.avg_vote >= Number(req.query.avg_vote)
        )
    }

    res.json(response)
};


app.get('/movies', handleGetMovie);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
