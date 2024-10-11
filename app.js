const express = require('express')
const jwt = require('jsonwebtoken')
const config = require('./public/scripts/config')
const port = 3000


const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/register.html')
})

app.get('/index', verifyToken, (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.post('/sinup', (req, res) => {
    console.log(`Post pagina de registro ${req.body.username}`)
    console.log(`Post pagina de registro ${req.body.password}`)

    if(`${req.body.username}` === 'Camilla Rosse'
        && `${req.body.password}` === '20') {
            console.log(`Usuario: ${req.body.username}, Password: ${req.body.password}`)
            const user = {
                usuario: `${req.body.username}`,
                password: `${req.body.password}`
            }

            jwt.sign({user: user}, config.secret, {expiresIn: '1h'}, (err, token) => {
               //res.json({token: token})
               //res.redirect('/');
                res.cookie('auth_token', token, { httpOnly: true });
                res.redirect('/index'); 
            })
    }else{
        return res.status(401).json({
            auth:false,
            message: 'No token provided'
        })
    }
})

function verifyToken(req, res, next){
    const bearerHeader = req.headers['Authorization']
    if(typeof bearerHeader !== 'undefined'){
        //split separa cadenas 
        bearerToken = bearerHeader.split('')[1]
        req.token = bearerToken
        next()
    }else{
        res.status(401)
        next()
    }
}

 //nuestro puerto
app.use (express.static('public'))
app.listen(port,() =>{
    console.log(`Servidor corriendo en el puerto: ${port}, http://localhost:${port}/`)
})