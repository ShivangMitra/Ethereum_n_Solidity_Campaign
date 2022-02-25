const Web3 = require('web3')
const CampaignFactory = require('./build/CampaignFactory.json')

let web3

if(typeof window !== 'undefined' && window.web3 !== 'undefined'){
    web3 = new Web3(window.web3.currentProvider)
}
else{
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/77e8ff36463d47128901ebd80576ae42'
    )
    web3 = new Web3(provider)
}

// const instance = new web3.eth.Contract(
//     CampaignFactory.abi,
//     '0x8ccDc406f7dd3Ea6b6FFce96f53117643F53B262'
// )

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0xd603E62Ca9f699e24C13202BF9E50bD704EF3d97'
)

export default instance