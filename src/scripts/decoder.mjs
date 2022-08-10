import { ethers } from "ethers"
import MarketplaceAddress from '../frontend/contractsData/Marketplace-address.json' assert { type: "json" }
import NFTAddress from '../frontend/contractsData/NFT-address.json' assert { type: "json" }
import CalvinTokenAddress from '../frontend/contractsData/CalvinToken-address.json' assert { type: "json" }

const sigABIs = {
    [NFTAddress.address]: {
        '0xd85d3d27': {
            'method':'mint',
            'abi':'function mint(string memory _tokenURI) external returns(uint)'
        },
        '0xa22cb465': {
            'method':'setApprovalForAll',
            'abi':'function setApprovalForAll(address operator, bool approved) public virtual override'
        }
    },
    [MarketplaceAddress.address]: {
        '0xd38ea5bf': {
            'method':'purchaseItem',
            'abi':'function purchaseItem(uint _itemId) external payable nonReentrant'
        },
        // '0x744d5a31': {
        //     'method': 'makeItem',
        //     'abi': 'function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant'
        // },
        '0xfa00afc7': {
            'method':'makeItem',
            'abi':'function makeItem(address _nft, uint _tokenId, uint _price) external nonReentrant'//need to change the parameter IERC721 to address type
        }
    },
    [CalvinTokenAddress.address]: {

    }
}

//usd iface.getSighash("balanceOf"); get function hash.
export default function decode(contractAddress, sigHash, txData) {
    const m = sigABIs[contractAddress][sigHash];
    const iface = new ethers.utils.Interface([m['abi']]);
    const json = iface.decodeFunctionData(m['method'], txData);
    console.log(json);
}

//export {NFTAddress.address as nftAddress, MarketplaceAddress.address as mpAdress};
//module.exports.decode=decode;



