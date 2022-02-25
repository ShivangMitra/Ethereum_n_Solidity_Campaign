import React, { useState } from 'react'
import { Button, Form, Message, Input } from 'semantic-ui-react'
import Campaign from '../../../ethereum/campaign'
import Web3 from 'web3'
import { Link, Router } from '../../../routes'
import Layout from '../../../components/Layout'

function RequestNew({ address }) {

    const [description, setDescription] = useState('')
    const [value, setValue] = useState('')
    const [recipient, setRecipient] = useState('')

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
        .then((accounts) => {
            campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({
                from: accounts[0]
            })
            .then((data) => {
                console.log(data)
                Router.pushRoute(`/campaigns/${address}/requests`)
                setTransactionLoading(false)
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
          <Link route={`/campaigns/${address}/requests`} >
            <a>
                Back
            </a>
          </Link>
          <h2>Create a Request</h2>
        <Form onSubmit={(e) => { onSubmit(e) }} >
            <Form.Field>
                <label>Description</label>
                <Input onChange={(e) => { setDescription(e.target.value) }} />
            </Form.Field>
            <Form.Field>
                <label>Value in Ether</label>
                <Input onChange={(e) => { setValue(e.target.value) }} />
            </Form.Field>
            <Form.Field>
                <label>Recipient</label>
                <Input onChange={(e) => { setRecipient(e.target.value) }} />
            </Form.Field>

            <Button loading={transactionLoading ? true : false} color='orange' >
                Create
            </Button>
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
RequestNew.getInitialProps = async (props) => {
    const { address } = props.query

    return { address }
}

export default RequestNew