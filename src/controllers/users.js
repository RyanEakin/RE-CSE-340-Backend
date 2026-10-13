import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import {createUser, authenticateUser, getUserDetails, assignVolunteer, removeVolunteer, listProjByUserId} from '../models/users.js';

const ShowUserRegForm = async(req,res) => {
    const title = 'New User Registration';

    res.render('register', {title});
};

const ProcessUserRegForm = async(req,res) => {
    const {name, email, password} = req.body;

        // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to home page
        return res.redirect('/');
    }


        try {
        // Create the new user in the database
        const salt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash(password, salt);

        const newUserId = await createUser(name, email, passHash);

        req.flash('success', 'New User created successfully! Please Log in.');
        res.redirect(`/`);
    } catch (error) {
        console.error('Error creating new User:', error);
        req.flash('error', 'There was an error creating the Account. Please try again');
        res.redirect('/register');
    }
    
};

const showLogin = async(req,res) => {
    const title = 'Login';

    res.render('login', {title});
};

const processLogin = async(req,res) => {
    const {email, password} = req.body;

        // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to home page
        return res.redirect('/');
    }


    try {
        // login user from the database
        const UserId = await authenticateUser(email, password);

        if (UserId) {
            req.session.user = UserId;
            req.flash('success', 'User logged in successfully!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', UserId.role_name);
            }

            res.redirect('/dashboard');
        }
        else{
            req.flash('error', 'Invalid email or password.')
            res.redirect('/login')
        }


    } catch (error) {
        console.error('Error logging User in:', error);
        req.flash('error', 'There was an error logging into the Account. Please try again');
        res.redirect('/login');
    }
};

const processLogout = async(req,res) => {
    try {
        // logout user from site
        if(req.session.user){
            delete req.session.user;
        }

        req.flash('success', 'User logged out successfully!');
        res.redirect(`/login`);

    } catch (error) {
        console.error('Error logging User out:', error);
        req.flash('error', 'There was an error logging out of the Account. Please try again');
        res.redirect('/login');
    }
};


const requireCred = async(req, res, next) => {
    // use this to prevent 'go back a page' info leak from recently logged out accounts
    res.set('Cache-Control', 'no-store'); 

    if (!req.session.user || !req.session) { // position is important, deny first, THEN allow. else it crashes
        req.flash('error','An Account is needed for this for action');
        res.redirect('/login');
    }
    else{
        next();
    }
};

const requirePerm = (role) => {
    return (req, res, next) => {

        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};

const showDashboard = async(req,res) => {
    const user = req.session.user;
    const projList = await listProjByUserId(user.user_id);
    //console.log(projList);

    console.log(user);

    res.render('dashboard', {title: 'Dashboard', role: user.role_name,name: user.name, email: user.email, projList: projList});
    // had to change user.name to user.role_name for this line to work
};

const showMngemntDashboard = async(req,res) => {
    // gotta remember that req comes first, THEN res.
    const userDetails = await getUserDetails();
    const title = 'User Management';

    //console.log(userDetails);

    res.render('user_management',{title, userDetails});
};

const volunteerSignUp = async (req,res) => {
    try {
        const projectId = req.params.id;

        if(req.session.user){
            const userId = req.session.user.user_id;

            const result = await assignVolunteer(userId,projectId);

            req.flash("success","you have successfully volunteered for this project!");
            if(process.cwd() === `/project/${projectId}`) { // this checks if the Current Working Directory is /project/:
                //if true go there
                res.redirect(`/project/${projectId}`);
            } else {
                // if not /project/, go here
                res.redirect(`/dashboard`);
            }
        }
    } catch (error) {
        console.error('Error Signing user up for Service Project:', error);
        req.flash('error', 'There was an error signing user up for service project. Please try again');
        res.redirect(`/project/${projectId}`);
    }
};

const volunteerOptOut = async (req,res) => {
    try {
        const projectId = req.params.id;
        if(req.session.user){
            const userId = req.session.user.user_id;

            const result = await removeVolunteer(userId,projectId);
            req.flash("success","you have opted-out of this project!");
            if(process.cwd() === `/project/${projectId}`) { // this checks if the Current Working Directory is /project/:
                //if true go there
                res.redirect(`/project/${projectId}`);
            } else {
                // if not /project/, go here
                res.redirect(`/dashboard`);
            }
        }
    } catch (error) {
        console.error('Error Opting user out of Service Project:', error);
        req.flash('error', 'There was an error opting User out of the service project. Please try again');
        res.redirect(`/project/${projectId}`);
    }
};

const regValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('username is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('username must be between 3 and 150 characters'),
    body('email')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Password must be between 3 and 150 characters'),
];

const userValidation = [
    body('email')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Password must be between 3 and 150 characters'),
];

export {ShowUserRegForm, ProcessUserRegForm, regValidation, userValidation, requireCred, requirePerm, showDashboard, showMngemntDashboard, showLogin, processLogin, processLogout, volunteerSignUp, volunteerOptOut}