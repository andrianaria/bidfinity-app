import { Request, Response } from 'express';
import i18n from '../i18n';
import sequelize from '../db';
import Bid from '../models/bid.model';
import User from '../models/user.model';

const createBid = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { bid_price, user_id, item_id } = req.body;

    // Retrieve the user's last bid
    const lastBid = await Bid.findOne({
      where: {
        user_id,
        item_id,
      },
      order: [['created_at', 'DESC']],
    });

    if (lastBid) {
      // Calculate the difference in milliseconds between the current time and the user's last bid time
      const currentTime = new Date();
      const lastBidTime = lastBid.created_at;
      const timeDifference = currentTime.getTime() - lastBidTime.getTime();
      console.log(i18n.t('bid.error.fiveSecondsLimit'));

      if (timeDifference < 5000) {
        // Less than 5 seconds since the user's last bid
        return res.status(400).json({ message: i18n.t('bid.error.fiveSecondsLimit') });
      }
    }

    const user = await User.findByPk(user_id, { transaction: t });
    if (!user) {
      return res.status(400).json({ message: i18n.t('userNotFound') });
    }

    // Get the previous last Bid amount for the same item made by the user
    const previousBidsSum = lastBid?.bid_price || 0;

    if (user.balance < bid_price) {
      return res.status(400).json({ message: i18n.t('bid.error.notEnoughBalance') });
    }

    // Update user balance
    user.balance -= (bid_price - previousBidsSum);
    await user.save({ transaction: t });
    
    // Create the bid in the database
    const bid = await Bid.create({
      bid_price,
      user_id,
      item_id,
    }, { transaction: t });

    await t.commit();

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    await t.rollback();
    res.status(500).json({ message: i18n.t('common.error', {error})});
  }
};

export default createBid;
