// Import the necessary models
import sequelize from '../db';
import Item from '../models/item.model';
import Bid from '../models/bid.model'; 
import { Request as ExpressRequest, Response } from 'express'; 
import { Op } from 'sequelize';
import User from '../models/user.model';
import i18n from '../i18n';

interface CustomRequest extends ExpressRequest {
  user: { id: number }; // Add the 'user' property with its type
}

const getOngoingItems = async (req: ExpressRequest, res: Response) => {
  try {
    const items = await Item.findAll({
      attributes: [
        'id',
        'name',
        'start_price',
        'is_published',
        'created_by',
        'created_at',
        'updated_at',
        [
          sequelize.literal(
            `(SELECT bid_price FROM Bids WHERE item_id = Item.id ORDER BY created_at DESC LIMIT 1)`
          ),
          'last_bid',
        ],
        [
          sequelize.literal(
            `(published_at + time_window - CURRENT_TIMESTAMP)`
          ),
          'time_window',
        ],
      ],
      include: [
        {
          model: Bid,
          attributes: [],
        },
      ],
      where: {
        is_published: true,
        [Op.and]: [
          sequelize.literal(
            `(published_at + time_window) > CURRENT_TIMESTAMP`
          ),
        ],
      },
    });

    res.send(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: i18n.t('common.error', {error})});
  }
};

const getCompletedItems = async (req: ExpressRequest, res: Response) => {
  try {
    const currentTimestamp = Date.now();

    const items = await Item.findAll({
      attributes: [
        'id',
        'name',
        'start_price',
        'is_published',
        'created_by',
        'created_at',
        'updated_at',
        [
          sequelize.literal(
            `(SELECT bid_price FROM Bids WHERE item_id = Item.id ORDER BY created_at DESC LIMIT 1)`
          ),
          'last_bid',
        ],
        [
          sequelize.literal(
            `(0)`
          ),
          'time_window',
        ],
      ],
      include: [
        {
          model: Bid,
          attributes: [],
        },
      ],
      where: {
        is_published: true,
        [Op.and]: [
          sequelize.literal(
            `(published_at + time_window) < CURRENT_TIMESTAMP`
          ),
        ],
      },
    });

    res.send(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: i18n.t('common.error', {error}) });
  }
};


// Create a new item
const createItem = async (req: ExpressRequest, res: Response) => {
  try {
    const { name, start_price, time_window, is_published, created_by } = req.body;

    // Create the item in the database
    const item = await Item.create({
      name,
      start_price,
      time_window,
      is_published,
      created_by,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: i18n.t('common.error', {error}) });
  }
};

const getDraftItems = async (req: CustomRequest, res: Response) => {
  try {
    const currentUser = req.query.userId; // Assuming you have user information available in the request

    // Query draft items with their corresponding bids for the current user
    const items = await Item.findAll({
      where: {
        is_published: false,
        created_by: currentUser,
      },
      attributes: [
        'id',
        'name',
        'start_price',
        'time_window',
        'is_published',
        'created_by',
        'created_at',
        'updated_at',
        [
          sequelize.literal(
            `(SELECT bid_price FROM Bids WHERE item_id = Item.id ORDER BY created_at DESC LIMIT 1)`
          ),
          'last_bid',
        ],
      ],
      include: [
        {
          model: Bid,
          attributes: [],
        },
      ],
    });

    // Send the response with the retrieved draft items
    res.send(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: i18n.t('common.error', {error}) });
  }
};

const publishItem = async (req: ExpressRequest, res: Response) => {
  try {
    const itemId = req.params.itemId; // Assuming you're passing the item ID in the request params

    // Find the item by ID
    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ message: i18n.t('item.error.itemNotFound') });
    }

    // Update the item to set is_published to true and published_at to current time
    item.is_published = true;
    item.published_at = new Date();
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: i18n.t('common.error', {error}) });
  }
};

const getItemHistory = async (req: CustomRequest, res: Response) => {
  try {
    const itemId = req.params.itemId;

    // Retrieve the item by its ID
    const item = await Item.findOne({
      attributes: [
        'id',
        'name',
        'start_price',
        'is_published',
        'created_by',
        'created_at',
        'updated_at',
        [
          sequelize.literal(
            `(SELECT bid_price FROM Bids WHERE item_id = Item.id ORDER BY created_at DESC LIMIT 1)`
          ),
          'last_bid',
        ],
        [
          sequelize.literal(
            `(published_at + time_window - CURRENT_TIMESTAMP)`
          ),
          'time_window',
        ],
      ],
      include: [
        {
          model: Bid,
          attributes: [],
        },
      ],
      where: {
        id: itemId, // Specify the item ID to retrieve
      },
    });

    if (!item) {
      return res.status(404).json({ message: i18n.t('item.error.itemNotFound') });
    }

    // Retrieve the bid history for the item
    const bidHistory = await Bid.findAll({ 
      where: {item_id: itemId },
      order: [['created_at', 'DESC']],
      include: {
        model: User,
        attributes: ['name'], // Select the 'name' attribute from the User model
      },
    });

    res.json({ item, bidHistory });
  } catch (error) {
    console.error('Error retrieving bid history:', error);
    res.status(500).json({ message: i18n.t('common.error', {error}) });
  }
}

export {
  getItemHistory,
  getCompletedItems,
  getOngoingItems,
  getDraftItems,
  publishItem,
  createItem,
};

