import { Request, Response } from 'express'; 
import i18n from '../i18n';
import Deposit from '../models/deposit.model';
import User from '../models/user.model';

// Create a deposit and update user's balance
const createDeposit = async (req: Request, res: Response) => {

  const { user_id, amount } = req.body;
  try {
    // Create a deposit record
    const deposit = await Deposit.create({
      user_id: user_id,
      amount: amount,
    });

    // Find the user
    const user = await User.findByPk(user_id);

    // Update user's balance by adding the deposit amount
    const updatedBalance = user!.balance + parseFloat(amount);
    user!.balance = updatedBalance;
    await user!.save();

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: i18n.t('common.error', {error})});
    throw new Error('Failed to create deposit');
  }
};

export { createDeposit };
