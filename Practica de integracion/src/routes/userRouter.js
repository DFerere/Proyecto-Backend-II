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
router.post('/signup_passport',
    passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }),
    async (req, res) => {
        res.redirect('/ecommerce/home/login');
    }
);

//LOGIN CON GITHUB

router.post('/login_passport',

    passport.authenticate('login', { failureRedirect: '/api/sessions/failurelogin' }),
    async (req, res) => {
        //guardamos info del usuario en session
        req.session.first_name = req.user.first_name;
        req.session.last_name = req.user.last_name;
        req.session.email = req.user.email;
        req.session.age = req.user.age;
        req.session.rol = req.user.rol;
        req.session.isLogged = true;
    
    
       // res.redirect('/mongo/products/catalog');

        res.redirect('/api/sessions/current');
    }
);

router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    const user = await usersModel.findOne({ email, password }).lean();

    if (!user) { //validamos si usuario ya existe en la BD
        return res.send("Credenciales INVALIDAS");
    }

    //const user = await usersModel.create({ username, email, password });
    //console.log(username); 
    //guardamos info del usuario en session
    req.session.username = username;
    req.session.email = user.email;
    req.session.isLogged = true;

    //res.send("Bienvenido");

    res.redirect('/mongo/products/catalog');

    //res.redirect('/ecommerce/home/profile');



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
        //res.redirect('/ecommerce/home/profile');
        res.redirect('/mongo/products/catalog'); 
    }); 


/*router.get('/profile', async (req, res) => {

    const { username, email} = req.session;
    console.log(username);

    //const userExists = await usersModel.findOne({ email });

    /*if (userExists) { //validamos si usuario ya existe en la BD
        return res.send("El usuario ya existe");
    }*/

//const user = await usersModel.create({ username, email, password });
//console.log(username); 
//guardamos info del usuario en session
/*req.session.username = username;
req.session.email = email;
req.session.isLogged = true;*/

//res.send("Bienvenido");

/*res.render('/profile', { username, email});



});*/

export default router;
