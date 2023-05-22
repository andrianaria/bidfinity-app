import { Request, Response } from 'express';
import { signup } from '../controllers/user.controller';
import i18n from '../i18n';
import User from '../models/user.model';

jest.mock('../models/user.model'); // Mock the User model

describe('signup', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const existingUser = null; // User with the same email doesn't exist
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      balance: 0,
    };

    (User.findOne as jest.Mock).mockResolvedValueOnce(existingUser);
    (User.create as jest.Mock).mockResolvedValueOnce(newUser);

    await signup(req as Request, res as Response);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(User.create).toHaveBeenCalledWith(newUser);
    expect(res!.send).toHaveBeenCalledWith(newUser);
  });

  it('should return 409 if user with the same email already exists', async () => {
    const existingUser = { name: 'Existing User', email: 'john@example.com', password: 'password456' };
    const sendMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: sendMock }));

    (User.findOne as jest.Mock).mockResolvedValueOnce(existingUser);

    await signup(req as Request, { status: statusMock } as unknown as Response);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(statusMock).toHaveBeenCalledWith(409);
    expect(sendMock).toHaveBeenCalledWith({ message: i18n.t('user.error.alreadyRegistered') });
  });

  it('should return 500 if an error occurs during signup', async () => {
    const error = new Error('Simulated error');
    const sendMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: sendMock }));
  
    (User.findOne as jest.Mock).mockRejectedValueOnce(error);
  
    await signup(req as Request, { status: statusMock } as unknown as Response);
  
    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(sendMock).toHaveBeenCalledWith({ message: i18n.t('common.error', { error }) });
  });
});
