const { ethers, network } = require("hardhat")
const {
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    VOTING_DELAY,
    proposalsFile,
} = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-blocks")
const fs = require("fs")

async function proposeChange(args, functionToCall, proposalDescription) {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposal Description:\n  ${proposalDescription}`)
    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    )

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1)
    }
    const proposeReceipt = await proposeTx.wait(1)
    const proposalId = proposeReceipt.events[0].args.proposalId
    console.log(`Proposed with proposal ID:\n  ${proposalId}`)

    const proposalState = await governor.state(proposalId)
    const proposalSnapShot = await governor.proposalSnapshot(proposalId)
    const proposalDeadline = await governor.proposalDeadline(proposalId)

    storeProposalId(proposalId)

    // The state of the proposal. 1 is not passed. 0 is passed.
    console.log(`Current Proposal State: ${proposalState}`)
    // What block # the proposal was snapshot
    console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
    // The block number the proposal voting expires
    console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}

function storeProposalId(proposalId) {
    const chainId = network.config.chainId.toString()
    let proposals
    if (fs.existsSync(proposalsFile)) {
        proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    } else {
        proposals = {}
        proposals[chainId] = []
    }
    proposals[chainId].push(proposalId.toString())
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals), "utf8")
}

proposeChange([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
