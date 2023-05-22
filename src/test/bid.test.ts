import { Request, Response } from 'express';
import createBid from '../controllers/bid.controller';
import i18n from '../i18n';
import User from '../models/user.model';
import Bid from '../models/bid.model';

jest.mock('../models/bid.model'); // Mock the Bid model

describe('createBid', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        bid_price: 100,
        user_id: 1,
        item_id: 1,
      },
    } as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if there is a last bid within 5 seconds', async () => {
    const lastBid = { created_at: new Date() };
    const sendMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: sendMock }));

    (Bid.findOne as jest.Mock).mockResolvedValueOnce(lastBid);

    await createBid(req as Request, { status: statusMock } as unknown as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ message: i18n.t('bid.error.fiveSecondsLimit') });
  });

  it('should return 400 if user is not found', async () => {
    const sendMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: sendMock }));
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null);

    await createBid(req as Request, { status: statusMock } as unknown as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ message: i18n.t('userNotFound') });
  });

  it('should return 400 if user has insufficient balance', async () => {
    const user = User.build({ 
      name: 'John',
      email: 'john@example.com',
      password: 'password',
      balance: 50, 
    });
    const sendMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: sendMock }));

    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(user);

    await createBid(req as Request, { status: statusMock } as unknown as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ message: i18n.t('bid.error.notEnoughBalance') });
  });

  it('should create a bid and update user balance if all conditions are met', async () => {
    const user = User.build({
      id: 1,
      name: 'John',
      email: 'john@example.com',
      password: 'password',
      balance: 200,
      save: jest.fn(),
    });
    const createdBid = Bid.build({
      id: 1,
      bid_price: 100,
      user_id: 1,
      item_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const saveMock = jest.fn().mockResolvedValue(user);
    user.save = saveMock;

    (Bid.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(user);
    (Bid.create as jest.Mock).mockResolvedValueOnce(createdBid);

    await createBid(req, res);

    expect(saveMock).toHaveBeenCalled();
    expect(user.balance).toBe(100);
    expect(res.status).toHaveBeenCalledWith(expect.any(Number));
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('should handle and log errors and return 500 status', async () => {
    const error = new Error('Simulated error');
    const sendMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: sendMock }));
    (Bid.findOne as jest.Mock).mockRejectedValueOnce(error);

    await createBid(req as Request, { status: statusMock } as unknown as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(sendMock).toHaveBeenCalled();
  });
});
