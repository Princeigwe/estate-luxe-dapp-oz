// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


contract EstateLuxeOZepp is ERC721 {

  struct Realty {
    uint256 tokenId;
    string location;
    string description;
    uint256 price;
    address payable owner;
    bool isForSale;
    string image;
  }

  struct RealtyTxn{
    uint256 tokenId;
    uint256 price;
    address payable seller;
    address payable buyer;
    uint256 date;
  }

  event RealtyListed(
    uint256 tokenId,
    string location,
    string description,
    uint256 price,
    address owner,
    bool isForSale,
    string image
  );

  event RealtyBought(
    uint256 tokenId,
    uint256 price,
    address payable seller,
    address payable buyer,
    uint256 date
  );

  event RealtyResell(
    uint256 tokenId,
    uint256 price,
    bool isForSale
  );

  event TokenMetadata(
    string description
  );

  Realty[] public realties;

  // mapping that return the address of the owner of a specific NFT
  mapping (uint256 => address) private _tokenOwner;

  // mapping that returns the number of NFTs owned by an address
  mapping (address => uint256) private _ownedTokensCount;

  mapping(address => mapping(address => bool)) private _isApprovedForAll;

  mapping(address => mapping(address => mapping(uint256 => bool))) private _isApprovedForSingle;

  mapping(uint256 => address) private _tokenApproval;

  mapping(uint256 => Realty) realtyProperty;

  // returns a list of realty transactions that has occurred, by its token id 
  mapping(uint256 => RealtyTxn[]) realtyTxns;

  mapping(uint256 => string) _tokenUri;

  uint256 tokenIndex;

  constructor()  
    ERC721("EstateLuxeOZepp", "ELX") 
  {}

  // the receive function receives Ether from and EOA to the current contract balance
  receive() external payable{}

  function createListing(
    string memory _location, 
    string memory _description, 
    uint256 _price,
    string memory _image,
    string memory _tokenCid
  )public{
    require(bytes(_location).length > 0, "Location must not be empty");
    require(bytes(_description).length > 0, "Description must not be empty");
    require(_price > 0, "Price must not be empty");
    require(bytes(_image).length > 0, "Image must not be empty");

    Realty memory realty = Realty({
      tokenId: tokenIndex,
      location: _location,
      description: _description,        
      price: _price,
      owner: payable(msg.sender),
      isForSale: true,
      image: _image
    });
    realtyProperty[tokenIndex]=realty;
    realties.push(realty);
    _safeMint(msg.sender, tokenIndex);
    setTokenUri(tokenIndex, _tokenCid);
    _tokenOwner[tokenIndex] = payable(msg.sender);
    _ownedTokensCount[payable(msg.sender)] += 1;
    tokenIndex++;

    emit RealtyListed(realty.tokenId, realty.location, realty.description, realty.price, realty.owner, realty.isForSale, realty.image);
    emit Transfer(address(0), payable(msg.sender), tokenIndex);
  }


  function buyRealty(uint256 tokenId) payable public{
    require(_tokenOwner[tokenId] != address(0), "Token does not exist");

    (uint256 _price, address _owner, bool _isForSale)  = findListing(tokenId);
    uint256 money = _price * (1 ether); //converting _price uint value to ether

    require(msg.sender != _owner, "You cannot buy your own property");
    require(msg.value >= money, "Insufficient ETH provided");
    require(_isForSale, "Token is not up for sale");

    if(msg.value > money){
      uint256 overcharge = msg.value - money;
      payable(msg.sender).transfer(overcharge);
    }
    payable(_tokenOwner[tokenId]).transfer(money);

    address previousOwner = _tokenOwner[tokenId];

    transferFrom(_tokenOwner[tokenId], msg.sender, tokenId);
    realtyProperty[tokenId].owner = payable(msg.sender);
    realtyProperty[tokenId].isForSale = false;
    
    RealtyTxn memory realtyTxn = RealtyTxn({
      tokenId: tokenId,
      price: _price,
      seller:payable(previousOwner),
      buyer: payable(msg.sender),
      date: block.timestamp
    });

    // to keep track of transactions
    realtyTxns[tokenId].push(realtyTxn);

    emit RealtyBought(
      realtyTxn.tokenId,
      realtyTxn.price,
      realtyTxn.seller,
      realtyTxn.buyer,
      realtyTxn.date
    );
  }

  function resellRealty(uint256 _tokenId, uint256 _price)payable public{
    require(_tokenOwner[_tokenId] != address(0), "NFT does not exist");
    require(_tokenOwner[_tokenId] == msg.sender, "Invalid token owner");
    require(_price > 0, "Input realty price");

    Realty memory realty = realtyProperty[_tokenId];
    realty.price = _price;
    realty.isForSale = true;

    emit RealtyResell(realty.tokenId,realty.price, realty.isForSale);
  }

  function getMyRealties()public view returns(uint256[] memory){
    uint256 numberOfTokens = _ownedTokensCount[msg.sender];
    if(numberOfTokens == 0){
      return new uint256[](0);
    }
    else{
      uint256[] memory myRealties = new uint256[](numberOfTokens);
      uint256 myRealtyIndex = 0;
      for (uint256 i = 0; i < realties.length; i++){
        if( realties[i].owner == payable(msg.sender)){
          myRealties[myRealtyIndex] = realties[i].tokenId;
          myRealtyIndex++;
        }
      }
      return myRealties;
    }
  }

  function getRealtyTxns(uint256 _tokenId)public view returns(RealtyTxn[] memory){
    require(_tokenOwner[_tokenId] != address(0), "NFT does not exist");
    return realtyTxns[_tokenId];
  }

  function findListing(uint256 _tokenId)view public returns(
    uint256 _price, 
    address _owner, 
    bool _isForSale
    ){
    Realty memory realty = realtyProperty[_tokenId];
    _price = realty.price; 
    _owner = realty.owner; 
    _isForSale = realty.isForSale; 
    return(
      _price, 
      _owner, 
      _isForSale
    );
  }

  function setTokenUri(uint256 _tokenId, string memory _tokenCid)public{
    string memory baseUri = "ipfs://";
    string memory tokenUri = string(abi.encodePacked(baseUri, _tokenCid));
    _tokenUri[_tokenId] = tokenUri;
  }

  function getTokenUri(uint256 _tokenId)public view returns(string memory){
    require(_tokenOwner[_tokenId] != address(0), "NFT does not exist");
    return _tokenUri[_tokenId];
  }

}
