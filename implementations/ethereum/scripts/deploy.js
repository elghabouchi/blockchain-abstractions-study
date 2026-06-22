const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  const TokenTours = await hre.ethers.getContractFactory("TokenTours");
  const tokenTours = await TokenTours.deploy();
  await tokenTours.waitForDeployment();

  const tokenToursAddress = await tokenTours.getAddress();
  console.log("TokenTours deployed to:", tokenToursAddress);

  const ReservationTours = await hre.ethers.getContractFactory("ReservationTours");
  const reservationTours = await ReservationTours.deploy(tokenToursAddress);
  await reservationTours.waitForDeployment();

  const reservationToursAddress = await reservationTours.getAddress();
  console.log("ReservationTours deployed to:", reservationToursAddress);

  const MarcheProduits = await hre.ethers.getContractFactory("MarcheProduits");
  const marcheProduits = await MarcheProduits.deploy();
  await marcheProduits.waitForDeployment();

  const marcheProduitsAddress = await marcheProduits.getAddress();
  console.log("MarcheProduits deployed to:", marcheProduitsAddress);

  const tx = await tokenTours.transferOwnership(reservationToursAddress);
  await tx.wait();

  console.log("TokenTours ownership transferred to ReservationTours.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
