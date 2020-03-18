// This query will fetch all events for the given sources
// The source might be: 
// - flip auctions: [<FLIP_ETH_A_ADDRESS>, <FLIP_BAT_A_ADDRESS>]
// - flop auctions: [<FLOP_ADDRESS>] 
export const allAuctionEvents = `query allLeveragedEvents($sources: [String!], $fromDate: Datetime) {
  allLeveragedEvents(
  filter: { 
  and:[ 
  {address: {in: $sources}},
  {timestamp: {greaterThan: $fromDate}},
    {
      or: [
        {type: {equalTo: "Tend"}},
        {type: {equalTo: "Dent"}},
        {type: {equalTo: "Kick"}},
        {type: {equalTo: "Deal"}},
      ]
    }
    ]
  }
  ) {
    nodes {
      id
      type
      ilk
      hash
      fromAddress
      amount
      payAmount
      minPayAmount
      maxPayAmount
      dgem
      ddai
      auctionId
      lot
      bid
      ink
      tab
      timestamp
      price
    }
  }
}`


// The sources apply the same as in the query for all auctions
// The difference is that we can specify auction ids and listen only for those events
export const specificAuctionEvents = `query allLeveragedEvents($sources: [String!], $auctionIds: [BigFloat!], $fromDate: Datetime) {
  allLeveragedEvents(
  filter: { 
  and:[ 
  {address: {in: $sources}},
  {auctionId: {in: $auctionIds}}
  {timestamp: {greaterThan: $fromDate}},
    {
      or: [
        {type: {equalTo: "Tend"}},
        {type: {equalTo: "Dent"}},
        {type: {equalTo: "Kick"}},
        {type: {equalTo: "Deal"}},
      ]
    }
    ]
  }
  ) { 
    nodes {
      id
      type
      ilk
      hash
      fromAddress
      amount
      payAmount
      minPayAmount
      maxPayAmount
      dgem
      ddai
      auctionId
      lot
      bid
      ink
      tab
      timestamp
      price
    }
  }
}`