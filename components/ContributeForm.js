import React, { useState } from 'react'
import { Form, Input, Message, Button } from 'semantic-ui-react'
import Campaign from '../ethereum/campaign'
import Web3 from 'web3'
import { Router } from '../routes'

function ContributeForm({ address }) {

    const [value, setValue] = useState(0)
    const [errorState, setErrorState] = useState({})
    const [transactionLoading, setTransactionLoading] = useState(false)

    function onSubmit(e){
        e.preventDefault()

        setTransactionLoading(true)
        setErrorState({
            message: '',
            state: false
        })

        const campaign = Campaign(address)

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

        web3.eth.getAccounts()
        .then(accounts => {
            campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether')
            })
            .then((data) => {
                console.log(data)
                setTransactionLoading(false)
                Router.replaceRoute(`/campaigns/${address}`)
            })
            .catch(err => {
                setErrorState({
                    message: err.message,
                    state: true
                })
                setTransactionLoading(false)
            })
        })
        .catch(err => {
            setErrorState({
                message: err.message,
                state: true
            })
            setTransactionLoading(false)
        })
    }

  return (
    <Form onSubmit={(e) => { onSubmit(e) }} >
        <Form.Field>
            <label>Amount to Contribute</label>
            <Input onChange={(e) => setValue(e.target.value)} label="ether" labelPosition='right' />
        </Form.Field>
        <Button loading={transactionLoading ? true : false} color='orange' >
            Contribute
        </Button>
        {
            errorState.state
            ?
            (
                <Message negative>
                    <Message.Header>Oops!</Message.Header>
                    <p>{errorState.message}</p>
                </Message>
            )
            :
            null
        }
    </Form>
  )
}

export default ContributeForm