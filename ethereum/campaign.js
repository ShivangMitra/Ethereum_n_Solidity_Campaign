const Web3 = require('web3')
const Campaign = require('./build/Campaign.json')


export default (address) => {
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
    
    const instance = new web3.eth.Contract(
        Campaign.abi,
        address
    )

    return instance
}