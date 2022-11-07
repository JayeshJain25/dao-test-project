const { network } = require("hardhat")

const {
    developmentChains,
    QUORUM_PERCENTAGE,
    VOTING_DELAY,
    VOTING_PERIOD,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await get("GovernanceToken")
    const timeLock = await get("TimeLock")
    const args = [
        governanceToken.address,
        timeLock.address,
        VOTING_DELAY,
        VOTING_PERIOD,
        QUORUM_PERCENTAGE,
    ]

    log("============================")
    log("Deploying GovernorContract and waiting for confirmations...")
    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args,
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")

        await verify(governorContract.address, [])
    }

    log("----------------------------------------------------")
}

module.exports.tags = ["all", "governor"]
