import {body} from 'express-validator';

export const RegistrationValidator = [
    body('name').notEmpty().withMessage('Full name is required'),
    body('email').notEmpty().withMessage('Email is required'),
    body('password').isLength({min: 6}).withMessage('Password is required')
];
