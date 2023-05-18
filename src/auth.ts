require('dotenv').config(); 

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/user.model'; 

// function to generate JWT token
function generateToken(user: User) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY || '', { expiresIn: '1d' });
  return token;
}

// middleware to check if the user is authenticated
function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || '') as unknown as { id: number };
    const user = User.findByPk(decoded.id);
    if (!user) throw new Error();
    next();
  } catch (e) {
    res.status(401).send({ message: 'Unauthorized' });
  }
}

// login API
async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).send({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send({ message: 'Invalid credentials' });

  const token = generateToken(user);
  res.send({ user, token });
}

export { authenticate, login };
