import React, { useEffect, useState } from 'react'
import factory from '../ethereum/factory'
import Layout from '../components/Layout'
import { Card, Button, Icon } from 'semantic-ui-react'
import { Link } from '../routes'

function CampaignIndex() {

  const [campaigns, setCampaigns] = useState([])
  const [items, setItems] = useState([])
  
  useEffect(() => {

    factory.methods.getDeployedCampaigns().call()
    .then((campaigns) => {
      setCampaigns(campaigns)
      
      let tempItems = items

      campaigns.map((address) => {
        tempItems.push({
          header: address,
          description: <Link route={`/campaigns/${address}`} ><a>View Campaign</a></Link>,
          fluid: true
        })
      })

      setItems([...tempItems])

    })
    .catch((err) => {console.log(err)})

  }, [])
  

  return (
    <Layout>
      <div>
        <h2>Open Campaigns</h2>
        <Link route='/campaigns/new' >
          <a>
            <Button animated color='orange' floated='right' >
              <Button.Content visible>Add Campaign</Button.Content>
              <Button.Content hidden>
                <Icon name="plus icon" />
              </Button.Content>
            </Button>
          </a>
        </Link>
        <Card.Group items={items} />
      </div>
    </Layout>
  )
}

export default CampaignIndex