import { Router } from 'express';
import { usersModel } from '../dao/models/usermodels.js';
import passport from 'passport';

const router = Router();

router.post('/signup', async (req, res) => {

    const { username, email, password } = req.body;
    console.log(username);

    const userExists = await usersModel.findOne({ email });

    if (userExists) { //validamos si usuario ya existe en la BD
        return res.send("El usuario ya existe");
    }

    if (email == "ecommerce_admin@ecommerce.com" || email == "adminCoder@coder.com") {
        const rol = "admin";
        const user = await usersModel.create({ username, email, password, rol });
        console.log(username);
    } else {
        const rol = "user";
        const user = await usersModel.create({ username, email, password, rol });
        console.log(username);
    }

    //guardamos info del usuario en session
    req.session.username = username;
    req.session.email = email;
    req.session.isLogged = true;

    res.redirect('/ecommerce/home/profile');



});

//REGISTRO CON GITHUB
router.post('/signup2',
    passport.authenticate('register', { failureRedirect: '/failregister' }),
    async (req, res) => {
        res.redirect('/ecommerce/home/login');
    }
);

//LOGIN CON GITHUB

router.post('/login2',

    passport.authenticate('login', { failureRedirect: '/login2' }),
    async (req, res) => {
        //guardamos info del usuario en session
        req.session.first_name = req.user.first_name;
        req.session.last_name = req.user.last_name;
        req.session.email = req.user.email;
        req.session.age = req.user.age;
        req.session.isLogged = true;
    
    
        res.redirect('/mongo/products/catalog');
    }
);

router.post('/login', async (req, res) => {

    const { username, password } = req.body;
    console.log(username);
    console.log(password);

    const user = await usersModel.findOne({ username, password }).lean();

    if (!user) { //validamos si usuario ya existe en la BD
        return res.send("Credenciales INVALIDAS");
    }

    //guardamos info del usuario en session
    req.session.username = username;
    req.session.email = user.email;
    req.session.isLogged = true;

    res.redirect('/mongo/products/catalog');


});

router.get( 
    '/github', 
    passport.authenticate('github', {scope: 'user : email'})
); 

router.get(
    '/githubcallback', 
    passport.authenticate('github', {failureRedirect: '/login'}), 
    (req, res) => {
        console.log("Voy a imprimir reques.user"); 
        console.log(req.user); 
        req.session.first_name = req.user.first_name;
        req.session.last_name = req.user.last_name;
        req.session.email = req.user.email;
        req.session.age = req.user.age;
        req.session.isLogged = true;
        res.redirect('/mongo/products/catalog'); 
    }); 


export default router;
