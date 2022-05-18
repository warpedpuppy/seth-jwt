require('dotenv').config();

const express = require('express');
const app = express();
app.use(express());
var jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

function verificationMiddleware (req, res, next) {

	if (!req.headers.authorization) {
		return res.send('no auth header');
	} else {
		if (req.headers.authorization.toLowerCase().includes('bearer')) {
			const token = req.headers.authorization.slice(7);
			const decoded = jwt.verify(token, JWT_SECRET);
			if (decoded) {
				req.decoded = decoded;
				next()
			} else {
				res.send('token not valid');
			}
		} else {
			res.send('token not valid');
		}
		
	}
}

app.post('/generate', (req, res) => {
	var token = jwt.sign({ username: "Seth" }, JWT_SECRET);
	res.json({token})
})

app.get('/protected', verificationMiddleware, (req, res) => {
	res.send(`yes! you have the proper jwt, ${req.decoded.username}`)
})

app.listen(8080, () => console.log('listening. . .'))