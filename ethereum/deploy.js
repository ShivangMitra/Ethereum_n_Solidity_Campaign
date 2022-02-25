const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const compiledFactory = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(
    'page unfair combine dog sketch mirror pull animal decorate lab analyst grass',
    'https://rinkeby.infura.io/v3/77e8ff36463d47128901ebd80576ae42'
)

const web3 = new Web3(provider)

const deploy = async () => {

    const accounts = await web3.eth.getAccounts()
  
    console.log('Attempting to deploy from account', accounts[0])
  
    const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({data: '0x' + compiledFactory.evm.bytecode.object})
    .send({from: accounts[0]})

    console.log('contract deployed to : ', result.options.address)
  
}
deploy();

// 0x8ccDc406f7dd3Ea6b6FFce96f53117643F53B262
// 0xd603E62Ca9f699e24C13202BF9E50bD704EF3d97