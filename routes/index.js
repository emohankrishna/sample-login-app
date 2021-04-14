const express = require('express');
const router = express.Router();
const { persons } = require('../models/database');

router.get('/', (req, res, next) => {
	return res.render('index.ejs');
});


router.post('/', (req, res, next) => {
	console.log(req.body);
	let personInfo = req.body;


	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {
			if(persons.some(person => person.email === personInfo.email)){
				res.send({ "Success": "Email is already used." });
			} else {
				persons.push({
					email: personInfo.email,
					username: personInfo.username,
					password: personInfo.password
				})
				res.send({ "Success": "You are successfully registered! Please login" });
			}
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});

router.get('/login', (req, res, next) => {
	return res.render('login.ejs');
});

router.post('/login', (req, res, next) => {
	console.log("Login : ", req.body);
	let data = req.body;
	if(!data.email || !data.password){
		res.send({ "Success": "PLease enter Email and Password" });
	}
	const filteredResults = persons.filter(val => val.email === data.email && val.password === data.password);
	if (filteredResults && filteredResults.length == 1) {
		req.session.user = {
			email : data.email,
			username : filteredResults[0].username
		}
		res.send({ "Success": "Success!" });

	} else if(persons.filter(val => val.email === data.email).length == 1){
		res.send({ "Success": "Wrong password!" });
	} else {
		res.send({ "Success": "This Email Is not registered!" });
	}
});

router.get('/profile', (req, res, next) => {
	console.log("profile");
	if(req.session.user && persons.filter(val => req.session.user.email === val.email).length == 1){
		return res.render('data.ejs', { "name": req.session.user.username, "email": req.session.user.email });
	}
	res.redirect('/');
});

router.get('/logout', (req, res, next) => {
	console.log("logout")
	if (req.session) {
		// delete session object
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});
module.exports = router;