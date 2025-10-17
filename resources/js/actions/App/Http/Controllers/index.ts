import AuthController from "./AuthController";
import AuctionItemController from "./AuctionItemController";
import BidController from "./BidController";

const Controllers = {
    AuthController: Object.assign(AuthController, AuthController),
    AuctionItemController: Object.assign(AuctionItemController, AuctionItemController),
    BidController: Object.assign(BidController, BidController),
};

export default Controllers;
