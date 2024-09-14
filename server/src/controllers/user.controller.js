const con = require("../db");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config()

const sendVerificationEmail = async (email, firstName, link) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: process.env.NODEMAILER_SENDER_EMAIL,
            pass: process.env.NODEMAILER_SENDER_PASSWORD
        }
    });

    const mailOptions = {
        from: "thakkar.yati@gmail.com",
        to: email,
        subject: "Sign Up Verification",
        text: `Hello, ${firstName}`,
        html: `
            <p>Hello, ${firstName}</p>
            <p>Please verify your email by clicking the button below:</p>
            <a href="${link}" style="
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                text-decoration: none;
                color: #ffffff;
                background-color: #007bff;
                border-radius: 5px;
                border: 1px solid #007bff;
            ">Verify Email</a>
            <p>Thank you!</p>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error: ', error);
        throw new Error(error.message);
    }
};

const createUser = async (req, res) => {
    const role = req.query.role;
    const { firstName, lastName, email, password } = req.body;

    con.connect(function (err) {
        if (err) {
            return res.status(572).json({
                success: false,
                message: "Error connecting to database"
            });
        };
        console.log("Connected!");
    });
    try {
        // Check if the email already exists
        const checkEmailQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
        con.query(checkEmailQuery, [email], async (err, results) => {
            if (err) {
                console.error('Error checking email:', err);
                return res.status(500).json({
                    success: false,
                    message: "Error checking email"
                });
            }

            if (results[0].count > 0) {
                // Email already exists
                return res.status(400).json({
                    success: false,
                    message: "Email already in exists"
                });
            }

            // Proceed with hashing password and inserting user
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.error('Error generating salt:', err);
                    return res.status(500).json({
                        success: false,
                        message: "Error generating salt"
                    });
                }

                bcrypt.hash(password, salt, (err, hashedPassword) => {
                    if (err) {
                        console.error('Error hashing password:', err);
                        return res.status(500).json({
                            success: false,
                            message: "Error hashing password"
                        });
                    }

                    const insertUserQuery = `INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)`;
                    con.query(insertUserQuery, [firstName, lastName, email, hashedPassword, role], async (err, result) => {
                        if (err) {
                            console.error('Error inserting user:', err);
                            return res.status(500).json({
                                success: false,
                                message: "Error while registering user"
                            });
                        }

                        console.log("User created successfully", result);
                        // Send verification email
                        const JSON_SECRET = process.env.JSON_SECRET;
                        const secret = JSON_SECRET + hashedPassword;

                        const payload = {
                            email: email,
                            _id: result.insertId,
                        };

                        const token = jwt.sign(payload, secret, { expiresIn: "60m" });

                        const link = `${process.env.VALIDATE_URL}/${result.insertId}/${token}`
                        console.log("link:", link)
                        await sendVerificationEmail(email, firstName, link);

                        res.status(200).json({
                            success: true,
                            message: "User created successfully & Verification mail has been sent. Please check your email to verify your account.",
                            user: result
                        });
                    });
                });
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error.",
            error: error.message
        });
    }
};

const verifyUser = async (req, res) => {
    const token = req.params.token;
    const id = req.params.id;

    con.connect(function (err) {
        if (err) {
            return res.status(572).json({
                success: false,
                message: "Error connecting to database",
                error: err.message
            });
        }
        console.log("Connected!");

        // Perform the query after successful connection
        const query = `SELECT * FROM users WHERE id = ?`;
        con.query(query, [id], (err, result) => {
            if (err) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                    error: err.message
                });
            }

            const user = result[0]; // result will be an array of users, typically you'd expect one result

            // If the user doesn't exist
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            try {
                const JSON_SECRET = process.env.JSON_SECRET;
                const secret = JSON_SECRET + user.password;

                const payload = jwt.verify(req.params.token, secret);

                const updateQuery = `UPDATE users SET isVerified = 1 WHERE id = ?`;
                con.query(updateQuery, [id], (updateErr) => {
                    if (updateErr) {
                        return res.status(500).json({
                            success: false,
                            message: "Error updating user verification status",
                            error: updateErr.message
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        message: "User verified successfully"
                    });
                });

            } catch (error) {

                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        success: false,
                        message: "Token expired"
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: "Error verifying token.",
                    error: error.message
                });
            }
        });
    });
};

const signInUser = async (req, res) => {
    const { email, password } = req.body
    try {
        con.connect(function (err) {
            if (err) {
                return res.status(572).json({
                    success: false,
                    message: "Error connecting to database",
                    error: err.message
                });
            }
            console.log("Connected!");

            // Query to find user by email
            const query = `SELECT * FROM users WHERE email = ?`;
            con.query(query, [email], async (err, result) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Error fetching user",
                        error: err.message
                    });
                }

                if (result.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found"
                    });
                }

                const user = result[0];

                if (!user.isVerified) {
                    return res.status(403).json({
                        success: false,
                        message: "Account not verified. Please verify your email before logging in."
                    });
                }

                // Compare the password using bcrypt
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid credentials"
                    });
                }

                // Check if the user's role is 'admin'
                if (user.role !== 'admin') {
                    return res.status(403).json({
                        success: false,
                        message: "You are not allowed to login from here"
                    });
                }

                // If all checks are valid, return success
                return res.status(200).json({
                    success: true,
                    message: "Login successful",
                    user: user
                });
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error verifying token.",
            error: error.message
        });
    }
}


module.exports = {
    createUser,
    verifyUser,
    signInUser
};