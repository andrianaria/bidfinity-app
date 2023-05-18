import User from "../models/user.model";
import { Request, Response } from 'express'; 
import i18n from "../i18n";

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: i18n.t('user.error.alreadyRegistered') });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      balance: 0,
    });

    res.send(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: i18n.t('common.error', {error})});
  }
}

export { signup }