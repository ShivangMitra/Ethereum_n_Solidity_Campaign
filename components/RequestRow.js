import React, { useState } from 'react'
import { Table, Button, Header, Icon, Modal } from 'semantic-ui-react'
import Web3 from 'web3'
import Campaign from '../ethereum/campaign'

import { Router } from '../routes'

const { Row, Cell } = Table

function RequestRow({ request, address, id, approversCount }) {

    const readyToFinalize = request.approvalCount > approversCount / 2

    const [errorState, setErrorState] = useState({})
    const [transactionLoading, setTransactionLoading] = useState(false)

    function onApprove(){

        setTransactionLoading(true)
        setErrorState({
            message: '',
            state: false
        })

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

        const campaign = Campaign(address)

        web3.eth.getAccounts()
        .then((accounts) => {
            campaign.methods.approveRequest(id).send({
                from: accounts[0]
            })
            .then((data) => {
                console.log(data)
                Router.replaceRoute(`/campaigns/${address}/requests`)
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

    function onFinalize(){
        setTransactionLoading(true)
        setErrorState({
            message: '',
            state: false
        })

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

        const campaign = Campaign(address)

        web3.eth.getAccounts()
        .then((accounts) => {
            campaign.methods.finalizeRequest(id).send({
                from: accounts[0]
            })
            .then((data) => {
                console.log(data)
                Router.replaceRoute(`/campaigns/${address}/requests`)
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
    <Row disabled={request.complete} positive={readyToFinalize && !request.complete} >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{Web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{`${request.approvalCount}/${approversCount}`}</Cell>
        {
            request.complete
            ?
            null
            :
            (
                <Cell><Button onClick={() => {onApprove()}} loading={transactionLoading ? true : false} color='green' basic >Approve</Button></Cell>
            )
        }
        {
            request.complete
            ?
            null
            :
            (
                <Cell><Button onClick={() => {onFinalize()}} loading={transactionLoading ? true : false} color='teal' basic >Finalize</Button></Cell>
            )
        }

        <Modal
            basic
            open={errorState.state}
            size='small'
            >
            <Header icon>
                <Icon color='red' name='terminal' />
                Oops
            </Header>
            <Modal.Content>
                <p>
                {errorState.message}
                </p>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' onClick={() => setErrorState({
                    message: '',
                    state: false
                })}>
                    <Icon name='remove' /> Close
                </Button>
            </Modal.Actions>
        </Modal>
    </Row>
  )
}

export default RequestRow