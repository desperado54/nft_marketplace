// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

import "./CalvinToken.sol";

contract Marketplace is ReentrancyGuard {

    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public itemCount; 
    CalvinToken public payToken;
    uint256 public listingPrice;
    uint public immutable royaltyPercent;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
        address payable originalCreator;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent, CalvinToken _payToken) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
        listingPrice = 200000000000000000;
        payToken = _payToken;
        royaltyPercent = 10;
    }

    // Make item to offer on the marketplace
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        // uint256 balance = payToken.balanceOf(msg.sender);
        // require(balance > 0, "Insufficient listing price"); //when listing fee is required.

        // increment itemCount
        itemCount ++;
        // transfer nft
        //_nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false,
            payable(msg.sender)
        );
        


        // emit Offered event
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        Item storage item = items[_itemId];
        uint totalPrice = getTotalPrice(item.itemId);
        uint royaltyFee = 0;
        uint txFee = ((item.price * feePercent) / 100);
        if(item.seller != item.originalCreator) {
            royaltyFee = ((item.price * royaltyPercent) / 100);
        }
        uint256 buyerBalance = payToken.balanceOf(msg.sender);
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(buyerBalance >= totalPrice, "not enough ether to cover item price and market fee");
        
        //require(!item.sold, "item already sold");

        // pay seller and feeAccount
        //item.seller.transfer(item.price);
        //feeAccount.transfer(_totalPrice - item.price);
        
        payToken.transferFrom(msg.sender, item.seller, totalPrice - txFee - royaltyFee);
        payToken.transferFrom(msg.sender, feeAccount, txFee);
        if(item.seller != item.originalCreator) {
            payToken.transferFrom(msg.sender, item.originalCreator, royaltyFee);
        }
        // transfer nft to buyer
        //item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        item.nft.transferFrom(item.seller, msg.sender, item.tokenId);
        // update item to sold
        item.sold = true;
        item.seller = payable(item.nft.ownerOf(item.tokenId)); //buyer becomes the new seller
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }
    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }
}
