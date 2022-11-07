const { ethers, network } = require("hardhat")
const {
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    VOTING_DELAY,
    MIN_DELAY,
} = require("../helper-hardhat-config")
const { moveTime } = require("../utils/move-time")
const { moveBlocks } = require("../utils/move-blocks")

async function queueAndExecute() {
    const args = [NEW_STORE_VALUE]

    const box = await ethers.getContract("Box")
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args)
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
    const governor = await ethers.getContract("GovernorContract")
    console.log("Queueing...")
    const queueTx = await governor.queue(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await queueTx.wait(1)

    if (developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1)
        await moveBlocks(1)
    }

    console.log("Executing....")
    const executeTx = await governor.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await executeTx.wait(1)
    const boxNewValue = await box.retrieve()
    console.log(`New Box Value: ${boxNewValue.toString()}`)
}

queueAndExecute()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
