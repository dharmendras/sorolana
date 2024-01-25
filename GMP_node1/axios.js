const axios = require('axios');

async function pollSorobanDepositEvents() {
  try {
      const subscriptionData = {
          contract_id: process.env.CONTRACT_ID,
          topic1: 'AAAAEAAAAAEAAAABAAAADwAAAAxEZXBvc2l0RXZlbnQ=',
          topic2: 'AAAADwAAAAdkZXBvc2l0AA==',
          topic3: null,
          topic4: null,
          max_single_size: 1,
      };
      axios.post(`${process.env.MERCURY_BACKEND_ENDPOINT}/event`, subscriptionData, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.MERCURY_ACCESS_TOKEN}`,
          },
      })
      .then(response => {
          console.log('Subscription created successfully:', response);
      })
      .catch(error => {
          console.error('Error creating subscription:', error.message);
      });
  } catch (error) {
      console.log(":rocket: ~ pollSorobanDepositEvents ~ error:", error);
  }
}

pollSorobanDepositEvents()

