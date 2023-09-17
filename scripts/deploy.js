const path = require("path");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const holymolyplayer = await ethers.deployContract("HolymolyPlayer");
    const contract_address = await holymolyplayer.getAddress()
    console.log("Contract address:",contract_address)
    saveFrontendFiles(contract_address);

  }

   function saveFrontendFiles(contract_address) {
    const fs = require("fs");
    const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      path.join(contractsDir, "contract-address.json"),
      JSON.stringify({ HolymolyPlayer: contract_address }, undefined, 2)
    );
  
    const HolymolyPlayerArtifact = artifacts.readArtifactSync("HolymolyPlayer");
  
    fs.writeFileSync(
      path.join(contractsDir, "HolymolyPlayer.json"),
      JSON.stringify(HolymolyPlayerArtifact, null, 2)
    );
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });