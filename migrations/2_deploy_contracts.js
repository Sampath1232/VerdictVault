const VerdictVault = artifacts.require("VerdictVault");

module.exports = function (deployer) {
  deployer.deploy(VerdictVault);
};
