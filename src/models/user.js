const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task.js');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password can not contain "password"!')
            }
        }

    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age mus be positive")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type:Buffer

    }


}, {
    timestamps: true
})

//Reference to another database virtually

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//Authenticate token methods user for individual user

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token
}

//Hiding password and tokens from client
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;


}

//Log in statics use for model
userSchema.statics.findByCrudentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')

    }
    return user;
}

//Hash , the plain text password before saving(middleware)

userSchema.pre('save', async function (next) {

    const user = this;
    // console.log(user);


    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()


})

//Delete user tasks when user removed(Using middleware)

userSchema.pre('remove', async function (next) {

    const user = this;
    await Task.deleteMany({ owner: user._id })

    next()

})


const User = mongoose.model('User', userSchema);

module.exports = User