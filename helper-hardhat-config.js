const { ethers } = require("hardhat")

const networkConfig = {
    5: {
        name: "goerli",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        entranceFee: ethers.utils.parseEther("0.001"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId: "3704",
        callbackGasLimit: "500000",
        interval: "30",
    },
    31337: {
        name: "hardhat",
        entranceFee: ethers.utils.parseEther("0.001"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        interval: "30",
        callbackGasLimit: "500000",
    },
    // 137: {
    //   name: "polygon",
    //   ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
    // },
}

const MIN_DELAY = 3600
const VOTING_PERIOD = 5
const VOTING_DELAY = 1
const QUORUM_PERCENTAGE = 4
const developmentChains = ["hardhat", "localhost"]
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

const NEW_STORE_VALUE = 77
const FUNC = "store"
const PROPOSAL_DESCRIPTION = "Proposal #1 77 in the Box!"
const proposalsFile = "proposals.json"

module.exports = {
    networkConfig,
    developmentChains,
    MIN_DELAY,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
    ADDRESS_ZERO,
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    proposalsFile,
}
