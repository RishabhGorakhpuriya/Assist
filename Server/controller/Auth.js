const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../middlware/mailTransporter');
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Generate a salt
const generateSalt = () => crypto.randomBytes(16).toString('hex');
exports.createUser = async (req, res) => {
    try {
        const { fullName, emailId, role, password } = req.body;

        // Validate the request
        if (!fullName || !emailId || !password) {
            return res.status(400).json({ message: 'All fields (name, email, password) are required' });
        }

        // Generate a new salt
        const salt = generateSalt();

        // Hash the password with the salt
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Server error', error: err.message });
            }

            // Create a new user
            const newUser = new User({
                fullName,
                emailId,
                role,
                password: hashedPassword.toString('hex'), // Ensure password is in hex format
                salt // Store the salt
            });

            // Save the user to the database
            const savedUser = await newUser.save();

            // Respond with the saved user
            res.status(201).json(savedUser);
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Validate the request
        if (!emailId || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Server error', error: err.message });
            }

            if (hashedPassword.toString('hex') !== user.password) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Create a JWT token
            const token = jwt.sign({ id: user._id, fullName: user.fullName, emailId: user.emailId, role: user.role,  date: user.createdAt }, SECRET_KEY, { expiresIn: '1h' });

            // Respond with the token
            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.UserList = async (req, res) => {
    try {
        // Extract token from headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token and extract user ID
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Fetch all users with the role 'student'
        const students = await User.find({ role: 'student' });

        // Respond with the list of students
        res.status(200).json(students);

    } catch (err) {
        console.error('Error fetching user list:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            req.send(401).json({ message: "No token found" });
        }
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user list:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}


exports.updateUserProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const { fullName, emailId } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No token found" });
        }
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }


        const updateProfile = await User.findByIdAndUpdate(id, { $set: { fullName, emailId } }, { new: true })
        if (!updateProfile) {
            return res.status(200).json({ message: "User Not found" });
        }
        res.status(200).json(updateProfile);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}


exports.forgotPassword = async (req, res) => {
    const { emailId } = req.body;
    if (!emailId) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        // const token = crypto.randomBytes(32).toString('hex');
        const secret = SECRET_KEY + user.password;
        const token = jwt.sign({emailId:user.emailId, id : user._id}, secret, {expiresIn:'10m'});
        user.resetToken = token;
        const resetURL = `http://localhost:4000/auth/reset-password/${user._id}/${token}`;
        console.log(resetURL);
        await sendEmail(emailId, 'Password Reset', `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetURL}">${resetURL}</a>`);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.resetPassword = async (req, res) => {
    const {id, token} = req.params
    console.log(req.params);
    const user = await User.findOne({_id:id});
    if(!user){
        return res.status(404).json({ message: 'user not found' });
    }
    const secret = SECRET_KEY + user.password;
    try{
        const verify = jwt.verify(token, secret);
        res.render("index", { userId: id, token:token, email: verify.emailId, status:"Not Verfied"});
    }catch(error){
        res.send("Not Verified");
    }
}

exports.resetPasswordPost = async (req, res) => {
    const {id, token} = req.params;
    const {password} = req.body
    const user = await User.findOne({_id:id});
    if(!user){
        return res.status(404).json({ message: 'user not found' });
    }

    const secret = SECRET_KEY + user.password;
    try {
        const verify = jwt.verify(token, secret);
        
        // Generate a salt (random string)
        const salt = generateSalt();
        
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Server error', error: err.message });
            }

            // Update the user with the new password hash and new salt
            await User.updateOne({ _id: id }, {
                $set: { password: hashedPassword.toString('hex'), salt: salt }
            });
            return res.status(200).json({ message: 'Password updated successfully' });
        });
    } catch (error) {
        console.log(error);
        res.status(401).send("Something went wrong");
    }
}
