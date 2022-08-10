require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
  defaultNetwork: "ganache",
  networks: {
      ganache: {
          url: "http://localhost:7545",
          accounts: ["bdc7a0f18e8a4a5b6a577414c7b0c0d2ac5d22e60b814167d507f14447222db9", 
              "8b624f46bdf742b723369957769c16a0c9a36fcbcbf07edc0fee0e16d83891dc", 
              "56e03240797e68ac615bf8cfdd481edc13a68617bbf44a053f9504bbbe3404ef"]
      },
      mumbai: {
        url: "https://polygon-mumbai.infura.io/v3/05c4205740d347d9bf0e30b77b2ac960",
        accounts:["bdc7a0f18e8a4a5b6a577414c7b0c0d2ac5d22e60b814167d507f14447222db9"]
      },
      goerli: {
        url: "https://goerli.infura.io/v3/11f1469accbc473884fa50e686eef6cc",
        accounts:["d1150c6bf723bb8ebf95d8c4534f73a998357049b89e9208026d72ef8b468d76"] //0x26bdf75C1A3559060B10206AC99Af5A6dAb2aA03
      }
  },
};
