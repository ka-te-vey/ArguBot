const { signinSchema, signupSchema, acceptCodeSchma, acceptFPCodeSchema } = require('../middleware/validation');
const jwt = require('jsonwebtoken');
const { User } = require('../model/user');
const { doHashValidation, doHash, hmacProcess } = require('../utils/hashing');
const { sendMail } = require('../middleware/sendMail');
const { changePassword, changePasswordSchema } = require('../middleware/identification');
const transport = require('../middleware/sendMail');


exports.signin = async(req, res) => {
    const { email, password } = req.body;

    try {
        const { error } = signinSchema.validate({ email, password });
        if(error){
            return res.status(400).json({ success:false, message: error.message })
        }

        const existingUser = await User.findOne({ email }).select('+password')
        if(!existingUser){
            return res.status(401).json({ success:false, message: 'User already existed!' })
        }

        const isPasswordCorrect = await doHashValidation(password, existingUser.password);
        if(!isPasswordCorrect){
            return res.status(401).json({ success:false, message: 'Invalid credentials.' })
        }

        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified
        }, process.env.TOKEN_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.cookie('Authorization', 'Bearer ' + token, {
            expires: new Date(Date.now() + 8 + 360000),
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production'
        }) .json ({
            success: true,
            token,
            message: 'Logged in successfully!'
        });

    } catch (error) {
        return res.status(500).json({ success:false, message: error.message });
    }
};


exports.signup = async(req, res) => {
    const { name, email, password } = req.body;

    try {
        const { error } = signupSchema.validate({ name, email, password });
        if(error) {
            return res.status(400).json({ success:false, message: 'User already exists!' })
        }

        const hashedPassword = await doHash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({ success:true, message: 'User registered successfully!' });

    } catch (error) {
        return res.status(500).json({ success:false, message: error.message });
    }
};


exports.signout = async(req, res) => {
    res.clearCookie('Authorization').status(200).json({ success:true, message: 'Logged out successfully!' })
};


exports.sendVerificationCode = async(req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne ({ email });
        if (!existingUser) {
            return res.status(404).json({ success:false, message: 'User does not exists!'})
        }

        if (existingUser.verified) {
            return res(400).json({ success:false, message: 'You are already verified!' })
        }

        const codeValue = Math.floor(10000 + Math.random() * 90000).toString();

        let info = await WebTransport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMIAL_ADDESS,
            to: existingUser.email,
            subject: 'Verification Code',
            html: '<h1>' + codeValue + '</h1>'
        });

        if (info.accept[0] === existingUser.email) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);
            existingUser.verificationCode = hashedCodeValue;
            existingUser.verificationCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({ success:false, message: 'Code sent!' });
        } else {
            return res.status(500).json({ success:false, message: 'Failed to send email!' })
        }

    } catch (error) {
        return res.status(500).json({ success:false, message: error.messasge });
    }
};


exports.verifyVerificationCode = async (req, res) => {
    const { email, provideCode } = req.body;

    try {
        
        const { error } = await acceptCodeSchema.validate({ email, provideCode });

        if (error) {
            return res.status(400).json({ success:false, message: error.message })
        }

        const codeValue = provideCode.toString();
        const existingUser = await User.findOne({ email }).select('verificationCode +verificationCodeValidation');

        if (!existingUser) {
            return res.status(404).json({ success:false, message: 'User does not exsit!'})
        }

        if (existingUser.verified) {
            return res.status(400).json({ success:false, message: 'You are already verified!' })
        }

        if (!existingUser.verificationCode || !existingUser.verificationCodeValidation) {
            return res.status(400).json({ success:false, message: 'Something is wrong with the code!' })
        }

        if (Date.now() - existingUser.verificationCodeValidation > 2 * 60 * 1000) {
            return res.status(400).json({ success:false, message: 'Code has been expired!' })
        }

        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);

        if (hashedCodeValue === existingUser.verificationCode) {
            existingUser.verified = true;
            existingUser.verificationCode = undefined;
            existingUser.verificationCodeValidation = undefined;
            await existingUser.save();
            return res.status(200).json({ success:true, nmessage: 'You are now verified!' })
        }

        return res.status(400).json({ success:false, message: 'Unexpected occured!' })

    } catch (error) {
        return res.status(500).json({ success:false, message: error.message });
    }
};


exports.changePassword = async(req, res) => {
    const { userId, verified } = req.user;
    const { newPassword } = req.body;

    try {
        const { error, value } = changePasswordSchema.validate({ newPassword });

        if(error) {
            return res.status(400).json({ success:false, message: error.message })
        }

        if(!verified) {
            return res.status(400).json({ success:false, message: 'You are not verified user!' })
        }

        const existingUser = await User.findOne({ _id:userId}).select('+password');
        if(!existingUser) {
            return res.status(401).json({ success:false, message: 'User does not exists!' })
        }

        const hashedPassword = await doHash(newPassword, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();
        return res.status(200).json({ success:false, message: 'Password updated!' });

    } catch (error) {
        return res.status(500).json({ success:false, message: error.message})
    }
};


exports.sendForgotPasswordCode = async(req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if(!existingUser) {
            return res(401).json({ success:false, message: 'User does not exist!' })
        }

        const codeValue = Math.floor(10000 + Math.random() * 90000).toString();

        let info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMIAL_ADDESS,
            to: existingUser.email,
            subject: 'Verification Code',
            html: '<h1>' + codeValue + '</h1>'
        });

        if(info.accepted[0] === existingUser.email) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);

            existingUser.sendForgotPasswordCode = hashedCodeValue;
            existingUser.forgotPasswordCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({ success: true, message: 'Code Sent!' });
        } else {
            return res.status(200).json({ success:false, message: 'Failed to send mail!' });
        }

    } catch (error) {
        return res.status(500).json({ success:false, message: error.message});
    }
};


exports.verifyForgotPasswordCode = async(req, res) => {
    const { email, provideCode, newPassword } = req.body;

    try {
        const { error, value } = acceptFPCodeSchema.validate({ email, provideCode });

        if (error) {
            return res.status(400).json({ success:false, message: error.message });
        }

        const codeValue = provideCode.toString();
        const existingUser = await User.findOne({ email }).select('+forgotPasswordCode +forgotPasswordCodeValidation');

        if(!existingUser) {
            return res.status(400).json({ success:false, message: 'User does not exist!' })
        }

        if(!existingUser.forgotPasswordCode || !existingUser.forgotPasswordCodeValidation) {
            return res.status(400).json({ success:false, message: 'Something is wrong with the code!' })
        }

        if(Date.now() - existingUser.forgotPasswordCodeValidation > 3 * 60 * 10000) {
            return res.status(400).json({ success:false, message: 'Code has been expired!' })
        } 

        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);
        
        if(hashedCodeValue === existingUser.forgotPasswordCode) {
            const hashedPassword = await doHash(newPassword, 12);
            existingUser.password = hashedPassword;

            existingUser.forgotPasswordCode = undefined;
            existingUser.forgotPasswordCodeValidation = undefined;
            await existingUser.save();
            return res.status(200).json({ success:true, message: 'Your password has been reset successfully!' })
        }

    } catch (error) {
        return res.status(500).json({ success:false, message: error.message});
    }
};