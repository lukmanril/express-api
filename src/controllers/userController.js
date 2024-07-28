const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Fungsi untuk membuat JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Fungsi untuk membandingkan password
const comparePassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Daftar pengguna
const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return next(new ErrorResponse('User already exists', 400));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } catch (error) {
        next(error);
    }
};

// Dapatkan daftar pengguna
const getUsers = async (req, res, next) => {
    const keyword = req.query.keyword ? {
        name: {
            [Op.like]: `%${req.query.keyword}%`,
        },
    } : {};

    try {
        const users = await User.findAll({ where: { ...keyword } });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// Hapus pengguna
const deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Perbarui pengguna
const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.name = name || user.name;
        user.email = email || user.email;
        user.password = hashedPassword || user.password;

        await user.save();

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } catch (error) {
        next(error);
    }
};
  
  // Dapatkan satu pengguna
const getUserById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

// Login pengguna
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return next(new ErrorResponse('Invalid email or password', 401));
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return next(new ErrorResponse('Invalid email or password', 401));
        }

        const token = generateToken(user.id);
        user.token = token;
        await user.save();

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token,
        });
    } catch (error) {
        next(error);
    }
};

// Logout pengguna
const logoutUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        user.token = 'Logout';
        await user.save();

        res.json({ message: 'User logged out successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, getUsers, deleteUser, updateUser, getUserById, loginUser, logoutUser };