const CosmeticsTraceability = artifacts.require("CosmeticsTraceability");

module.exports = function(deployer) {
  deployer.deploy(CosmeticsTraceability);
};