import { authenticate, login } from '../auth';
import createBid from '../controllers/bid.controller';
import { createDeposit } from '../controllers/deposit.controller';
import { createItem, getDraftItems, publishItem, getOngoingItems, getCompletedItems, getItemHistory } from '../controllers/items.controller';
import { signup } from '../controllers/user.controller';

module.exports = (app: any) => {
  var router = require("express").Router();

  router.post("/login", login);
  router.post("/signup", signup);
  router.get("/items/completed", authenticate, getCompletedItems);
  router.get("/items/ongoing", authenticate, getOngoingItems);
  router.get("/items/draft", authenticate, getDraftItems);
  router.get("/items/:itemId/history", authenticate, getItemHistory)
  router.post("/items/:itemId/publish", authenticate, publishItem);
  router.post("/items", authenticate, createItem);
  router.post("/deposit", authenticate, createDeposit);
  router.post("/bid", authenticate, createBid);

  app.use('/api', router);
};