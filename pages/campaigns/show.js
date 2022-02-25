import React, { useEffect, useState } from 'react'
import { Card, Grid, Button } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import Campaign from '../../ethereum/campaign'
import ContributeForm from '../../components/ContributeForm'
import { Link } from '../../routes'
import Web3 from 'web3'

function CampaignShow({ address, minimumContribution, balance, requestsCount, approversCount, manager }) {

    function campaignCards(){
        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests to withdraw money.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to become an approver.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of people who have already donated to this campaign.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: Web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'This is how much money this campaign has left to spend.',
                style: { overflowWrap: 'break-word' }
            },
        ]

        return <Card.Group items={items} />
    }

  return (
      <Layout>
          <h2>Campaign Show</h2>
          <Grid>
              <Grid.Row>
                <Grid.Column width={10} >
                    {campaignCards()}
                </Grid.Column>
                <Grid.Column width={6} >
                    <ContributeForm address={address} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                    <Link route={`/campaigns/${address}/requests`} >
                        <a>
                            <Button color='orange' >
                                View Requests
                            </Button>
                        </a>
                    </Link>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                    <Link route={`/campaigns/${address}/requests/new`} >
                        <a>
                            <Button color='orange' >
                                Add Request
                            </Button>
                        </a>
                    </Link>
                </Grid.Column>
              </Grid.Row>
          </Grid>
      </Layout>
  )
}
CampaignShow.getInitialProps = async (props) => {
    const campaign = Campaign(props.query.address)

    const summary = await campaign.methods.getSummary().call()

    return {
        address: props.query.address,
        minimumContribution: summary[0],
        balance: summary[1],
        requestsCount: summary[2],
        approversCount: summary[3],
        manager: summary[4]
    }
  }

export default CampaignShow