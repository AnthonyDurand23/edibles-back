const User = require(`../models/user`);
const jwt = require(`../../services/token`);
const nodemailer = require('nodemailer');


const userController = {

    //controller for account creation
    signup:  async(request, response) => {
        try {
            await new User(request.body).save();
            response.status(201).json(`User created`);
        } catch (error) {
            console.log(error);
            response.status(500).json(error.message);
        }
    }, 

    //controller for the connection to the site
    login: async(request, response) => {
        try {
            const user = await new User(request.body).doLogin();
            response.setHeader(`Authorization`, jwt.makeToken(user));
            response.status(200).json(user);
        } catch (error) {
            console.log(error);
            response.status(500).json(error.message);
        }
    },

    //controller to get user informations from token
    getUser: async(request, response) => {
        try {
            const userId = request.payload.id;
            const user = await User.findById(userId);
            delete user.password;
            response.status(200).json(user);
        } catch (error) {
            console.log(error);
            response.status(500).json(error.message);
        }
    },

    // Controller to delete a user 
    deleteUser: async(request, response) => {
        try {
            const userId = request.payload.id;
            await User.delete(userId);
            response.status(200).json(`user deleted`);            
        } catch (error) {
            console.log(error);
            response.status(500).json(error.message);
        }
    },

    // Controller to edit info + user preferences 
    editUser: async(request, response) => {
        try {
            request.body.id = request.payload.id;
            const user = await new User(request.body).save();
            response.status(200).json(user);
        } catch (error) {
            console.log(error);
        }
    },

    // Controller to send reset link 
    forgotPassword: async(request, response) =>{
        try {
            const {email} = request.body;
            const user = await User.findByEmail(email);
            //user not exist 
            if(!user){
                response.status(404).send("user not exist ");
                return
            }
            //user exist , we can create token from user info
            
            const payload = {
                email: user.email,
                id: user.id
            };
            const token = jwt.makeToken(payload, process.env.SECRET);
            //now we can create the reset link
            const link = `https://edibles.surge.sh/resetPassword/${token}`;
            console.log(link);

            //here we gonna send the reset link to user email 
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth:{
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            let mailOptions= {
                from: process.env.EMAIL,
                to:`${email}`,
                subject:'[Edibles] Request to reset Password',
                text: `
                You are receiving this because you (or someone else) have requested the reset of the password for your account. 
                Please click on the following link, or paste this into your browser to complete the process:${link}
                If you did not request this, please ignore this email and your password will remain unchanged.`,
            }
            transporter.sendMail(mailOptions, (error) =>{
                if(error){
                    console.log(error);
                }else{
                    // console.log('password link has been sent to email');
                    response.status(200).send('password link has been sent to email');
                }
            })
        } catch (error) {
            console.log(error);
        }
    },

    // Controller to reset user password 
    resetPassword: async(request, response) =>{
        try {
            const id = request.payload.id;
            // console.log(id);
           const {password, repeatPassword} = request.body
            if(password !== repeatPassword) {
                response.send('Passwords must be the same');
                return
            }
            const user = await User.findById(id);
            // console.log(user)
            user.password = password;
            await user.save();
            response.status(200).send('Updated password');
 
        } catch (error) {
            console.log(error);
        }

    }

};

module.exports = userController;