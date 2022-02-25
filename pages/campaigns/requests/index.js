import React from 'react'
import Layout from '../../../components/Layout'
import { Button, Table } from 'semantic-ui-react'
import { Link } from '../../../routes'
import Campaign from '../../../ethereum/campaign'
import RequestRow from '../../../components/RequestRow'

const { Header, Row, HeaderCell, Body } = Table

function RequestIndex({ address, requests, requestCount, approversCount }) {

  return (
      <Layout>
          <h2>Requests</h2>
          <Link route={`/campaigns/${address}/requests/new`} >
            <a>
                <Button color='orange' floated='right' style={{ marginBottom: '10px' }} >
                    Add Request
                </Button>
            </a>
          </Link>
          <Table celled>
            <Header>
            <Row>
                <HeaderCell>ID</HeaderCell>
                <HeaderCell>Description</HeaderCell>
                <HeaderCell>Amount(Ether)</HeaderCell>
                <HeaderCell>Recipient</HeaderCell>
                <HeaderCell>Approval Count</HeaderCell>
                <HeaderCell>Approve</HeaderCell>
                <HeaderCell>Finalize</HeaderCell>
            </Row>
            </Header>
            <Body>
                {
                    requests.map((request, index) => (
                        <RequestRow key={index} request={request} address={address} id={index} approversCount={approversCount} />
                    ))
                }
            </Body>
          </Table>
          <div>{`Found ${requestCount} requests`}</div>
      </Layout>
  )
}
RequestIndex.getInitialProps = async (props) => {
    const { address } = props.query
    const campaign = Campaign(address)

    const approversCount = await campaign.methods.approversCount().call()

    const requestCount = await campaign.methods.getRequestsCount().call()
    const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((ele, index) => {
                return campaign.methods.requests(index).call()
            }))
            
    return { address, requests, requestCount, approversCount }

}

export default RequestIndex