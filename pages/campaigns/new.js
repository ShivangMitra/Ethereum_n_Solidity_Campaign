import React, { useState, useEffect } from 'react'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import factory from '../../ethereum/factory'
import Web3 from 'web3'
import { Router } from '../../routes'

function CampaignNew() {

    let web3

    const [minContri, setMinContri] = useState('')
    const [errorState, setErrorState] = useState({})
    const [transactionLoading, setTransactionLoading] = useState(false)

    function onSubmit(e){
        e.preventDefault()

        setTransactionLoading(true)
        setErrorState({
            message: '',
            state: false
        })

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
        .then((accounts) => {
            factory.methods.createCampaign(minContri).send({
                from: accounts[0]
            })
            .then((data) => {
                console.log(data)
                setTransactionLoading(false)
                Router.pushRoute('/')
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
      <Layout>
          <h2>Create a Campaign</h2>
          <Form onSubmit={(e) => { onSubmit(e) }} >
            <Form.Field>
                <label>Minimun Contribution</label>
                <Input onChange={(e) => { setMinContri(e.target.value) }} label='wei' placeholder='420' />
            </Form.Field>
            <Button loading={transactionLoading ? true : false} type='submit' color='orange' >Create</Button>
        </Form>
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
      </Layout>
  )
}

export default CampaignNew