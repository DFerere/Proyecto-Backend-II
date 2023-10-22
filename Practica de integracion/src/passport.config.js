import passport from 'passport';
import local from 'passport-local';
import GithubStrategy from 'passport-github2';
import { usersModel } from '../dao/models/usermodels.js';
import bcrypt from 'bcrypt';

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
            { passReqToCallback: true, usernameField: 'email' },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;
                try {

                    const userExists = await usersModel.findOne({ email: username });


                    if (userExists) {
                        return done(null, false);
                    }

                    if (email == "ecommerce_admin@ecommerce.com" || email == "adminCoder@coder.com") {
                        const rol = "admin";
                        const user = await usersModel.create({
                            first_name,
                            last_name,
                            email,
                            age,
                            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                            rol
                        });
                        return done(null, user);
                    } else {
                        const rol = "user";
                        console.log(rol);
                        const user = await usersModel.create({
                            first_name,
                            last_name,
                            email,
                            age,
                            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                            rol
                        });
                        return done(null, user);
                    }

                    /*const user = await usersModel.create({
                        first_name,
                        last_name,
                        email,
                        age,
                        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                        rol
                    });*/

                    //return done(null, user);
                }
                catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        'github',
        new GithubStrategy({
            clientID: 'Iv1.3ae8921143d00254',
            clientSecret: '047a3f9446e2a558e6734a2a8dd602ed41a14f28',
            callbackURL: 'http://localhost:8080/ecommerce/user/githubcallback',
            scope: ['user : email'],
        },
            async (accesToken, refreshToken, profile, done) => {
                console.log(profile);

                try {
                    const email = profile._json.email;
                    const user = await usersModel.findOne({ email });

                    passport.serializeUser((user, done) => {
                        done(null, user._id);
                    });
                
                    passport.deserializeUser(async (id, done) => {
                        const user = await usersModel.findById(id);
                        done(null, user);
                    });

                    if (!user) {
                        const newUser = usersModel.create({
                            first_name: profile._json.name,
                            last_name: '',
                            age: 18,
                            password: '',
                            email: profile._json.email
                        });

                        return done(null, newUser);
                    }

                    return done(null, user);
                }
                catch (error) {
                    return done(error);
                }



                done(null);

            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await usersModel.findById(id);
        done(null, user);
    });



    passport.use(
        'login',
        new LocalStrategy(
            { usernameField: 'email' },
            async (username, password, done) => {
                try {
                    const user = await usersModel.findOne({ email: username }).lean();
                    if (!user) {
                        return done(null, false);
                    }

                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false);
                    }

                    return done(null, user);
                    console.log("Passport autenticado"); 
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    
};

export default initializePassport;