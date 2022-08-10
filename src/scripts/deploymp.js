const CalvinTokenABI = require('../frontend/mumbai/CalvinToken.json')
const CalvinTokenAddress = require('../frontend/mumbai/CalvinToken-address.json')

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const calvinToken = new ethers.Contract(CalvinTokenAddress.address, CalvinTokenABI.abi, deployer)
  const Marketplace = await ethers.getContractFactory("Marketplace");
  console.log("pay token adress="+calvinToken.address);
  const marketplace = await Marketplace.deploy(1, calvinToken.address);
  console.log("market place address="+marketplace.address);
  saveFrontendFiles(marketplace , "Marketplace");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/mumbai";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });