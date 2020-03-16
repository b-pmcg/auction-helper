import { PublicService } from '@makerdao/services-core';
import BigNumber from 'bignumber.js';

const flopAddress = '0xcc2c9de81a29dc01a6d348c5ebb7572e5a92840d';
const flipEthContract = '0x816383cfe95e14a962b521c953ab15acbca16dbb';
const flipBatContract = '0x9fe8947687fba82e183db18bd9c676fa0b9135e6';

export default class ValidatorService extends PublicService {

  flipAuctionsLastSynced = 0;
  flopAuctionsLastSynced = 0;
  backInTime = 1000 * 60 * 60 * 68; // 68 hours;

  constructor(name = 'validator') {
    super(name, ['web3', 'smartContract']);
    this.queryPromises = {};
    this.staging = false;
    this.serverUrl = 'https://kovan-auctions.oasis.app/api/v1';

    // this.serverUrl = 'https://staging-cache.eth2dai.com/api/v1';
    this.id = 123;
  }

  async getQueryResponse(serverUrl, query, variables = {}) {
    const resp = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    const { data } = await resp.json();
    return data;
  }

  async getQueryResponseMemoized(serverUrl, query) {
    let cacheKey = `${serverUrl};${query}`;
    if (this.queryPromises[cacheKey]) return this.queryPromises[cacheKey];
    this.queryPromises[cacheKey] = this.getQueryResponse(serverUrl, query);
    return this.queryPromises[cacheKey];
  }

  async request(route, method, url = this._url, body = {}) {
    return new Promise(async (resolve, reject) => {
      let options = {};
      if (this._email) options = { headers: { 'X-User-Email': this._email } };
      if (method === 'GET') {
        options = { ...options, method };
      } else if (method === 'DELETE') {
        options = {
          ...options,
          method,
          body
        };
      } else {
        options = {
          ...options,
          method,
          body,
          headers: {
            ...options.headers,
            'Content-Type': 'application/json'
          }
        };
      }
      try {
        const result = await fetch(`${url}/${route}`, options);
        const { status, ...data } = await result.json();
        !status ? resolve(data) : reject(data);
      } catch (err) {
        reject(err);
      }
    }).catch(err => console.error(err));
  }

  // async getQueryResponseMemoized(serverUrl, query) {
  //   let cacheKey = `${serverUrl};${query}`;
  //   if (this.queryPromises[cacheKey]) return this.queryPromises[cacheKey];
  //   this.queryPromises[cacheKey] = this.getQueryResponse(serverUrl, query);
  //   return this.queryPromises[cacheKey];
  // }

  async fetchFlipAuctions(shouldSync = false) {
    let currentTime = new Date().getTime();
    const timePassed = currentTime - this.flipAuctionsLastSynced;
    let queryDate = new Date();
    

    if(shouldSync){
      queryDate = new Date(currentTime - timePassed);
    } else {
      queryDate = new Date(currentTime - this.backInTime);
    }

    this.flipAuctionsLastSynced = currentTime;

    return this.getAllAuctions({
      sources: [flipEthContract, flipBatContract],
      fromDate: queryDate
    })
  }

  async fetchFlopAuctions(shouldSync = false) {
    let currentTime = new Date().getTime();
    const timePassed = currentTime - this.flopAuctionsLastSynced;
    let queryDate = new Date();

    if(shouldSync){
      queryDate = new Date(currentTime - timePassed);
    } else {
      queryDate = new Date(currentTime - this.backInTime);
    }

    this.flopAuctionsLastSynced = currentTime;
    return this.getAllAuctions({
      sources: [flopAddress],
      fromDate: queryDate
    })
  }

  async getAllAuctions(variables) {

    const query = `query allLeveragedEvents($sources: [String!], $fromDate: Datetime) {
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
    }`;

    const response = await this.getQueryResponse(
      this.serverUrl,
      query,
      variables
    );
    console.log('GraphQL response', response);
    return response.allLeveragedEvents.nodes;
  }

  initialize(settings) {
    console.log('settings', settings);
    this._url = 'https://api.prylabs.net';
  }

  async getLots(id) {
    // const bidId = 2590;
    const bids = await this._flipperContract().bids(id);
    console.log('bids', bids);
    const lotSize = bids[0];
    return lotSize;
    // console.log('bid in service', bid);
  }
  //tend(uint id, uint lot, uint bid)
  async tend(id, size, amount) {
    function toRad(amount) {
      return BigNumber(amount.toString()).shiftedBy(45);
    }
    // console.log('id in tend', id);
    //auctionId, collateralAmount, highestBid
    // const lotSize = await this.getLots(id);
    // console.log('lotSize', lotSize);
    const lotSizeInWei = this.get('web3')._web3.utils.toWei(size.toString());
    const bidAmountRad = toRad(amount);

    console.log('id', id);
    console.log('lotSizeInWei', lotSizeInWei);
    console.log('bidAmountRad', bidAmountRad.toFixed());

    //convert amount to 10^45;

    // const collateralAmount = '50000000000000000000';
    // const highestBid = '1000000000000000000000000000000000000000000000';
    const tend = await this._flipperContract().tend(
      id,
      lotSizeInWei,
      bidAmountRad.toFixed()
    );
    console.log('tend in service', tend);
  }

  async getLots(id) {
    // const bidId = 2590;
    const bids = await this._flipperContract().bids(id);
    console.log('bids', bids);
    const lotSize = bids[0];
    return lotSize;
    // console.log('bid in service', bid);
  }
  //tend(uint id, uint lot, uint bid)
  async dent(id, size, amount) {

    function toRad(amount) {
      return BigNumber(amount.toString()).shiftedBy(45);
    }
    // console.log('id in tend', id);
    //auctionId, collateralAmount, highestBid
    // const lotSize = await this.getLots(id);
    // console.log('lotSize', lotSize);
    const lotSizeInWei = this.get('web3')._web3.utils.toWei(size.toString());
    const bidAmountRad = toRad(amount);

    console.log('id', id);
    console.log('lotSizeInWei', lotSizeInWei);
    console.log('bidAmountRad', bidAmountRad.toFixed());

    //convert amount to 10^45;

    // const collateralAmount = '50000000000000000000';
    // const highestBid = '1000000000000000000000000000000000000000000000';
    const tend = await this._flipperContract().dent(
      id,
      lotSizeInWei,
      bidAmountRad.toFixed()
    );
    console.log('tend in service', tend);
  }

  async getAuction(id) {
    console.log('fetching', id);
    try {
      return await this._flipperContract().bids(id);
    } catch (err) { }
  }

  async joinDaiToAdapter(address, amount) {
    await this._joinDaiAdapter.join(address, amount);
  }
  async exitDaiFromAdapter(address, amount) {
    await this._joinDaiAdapter.join(address, amount);
  }

  get flipperContractAddress() {
    return this._flipperContract.address;
  }

  get flipEthAddress() {
    return this._flipEthAdapter.address;
  }

  get joinDaiAdapterAddress() {
    return this._joinDaiAdapter.address;
  }

  _flipperContract({ web3js = false } = {}) {
    return this.get('smartContract').getContractByName('FLIPPER');
  }

  _flipEthAdapter({ web3js = false } = {}) {
    return this.get('smartContract').getContractByName('MCD_FLIP_ETH_A');
  }

  _joinDaiAdapter({ web3js = false } = {}) {
    return this.get('smartContract').getContractByName('MCD_JOIN_DAI');
  }
}
