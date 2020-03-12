import { PublicService } from '@makerdao/services-core';
import BigNumber from "bignumber.js";

export default class ValidatorService extends PublicService {
  constructor(name = 'validator') {
    super(name, ['web3', 'smartContract']);
    this.queryPromises = {};
    this.staging = false;
    this.serverUrl = '';
    this.id = 123;
  }

  async getQueryResponse(serverUrl, query) {
    const resp = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const { data } = await resp.json();
    assert(data, `error fetching data from ${serverUrl}`);
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

  async getAllAuctions() {
    // const query = `{activePolls {
    //   nodes {
    //       creator
    //       pollId
    //       blockCreated
    //       startDate
    //       endDate
    //       multiHash
    //       url
    //     }
    //   }
    // }`;

    const response = await this.getQueryResponse(this.serverUrl, query);
    console.log('GraphQL response', response);
    // return response.activePolls.nodes.map(p => {
    //   p.startDate = new Date(p.startDate * 1000);
    //   p.endDate = new Date(p.endDate * 1000);
    //   return p;
    // });
  }

  initialize(settings) {
    console.log('settings', settings);
    this._url = 'https://api.prylabs.net';
  }

  async getLots(id) {
    // const bidId = 2590;
    const bids = await this._flipperContract().bids(id)
    console.log('bids', bids);
    const lotSize = bids[0]
    return lotSize;
    // console.log('bid in service', bid);
  }
  //tend(uint id, uint lot, uint bid)
  async tend(id, size, amount) {
    function toRad(value) {
      return BigNumber(amount.toString()).shiftedBy(45);
    }
    // console.log('id in tend', id);
    //auctionId, collateralAmount, highestBid
    // const lotSize = await this.getLots(id);
    // console.log('lotSize', lotSize);
    const lotSizeInWei = this.get('web3')._web3.utils.toWei(size.toString());
    const bidAmountRad = toRad(amount);

    console.log('id', id)
    console.log('lotSizeInWei', lotSizeInWei)
    console.log('bidAmountRad', bidAmountRad.toFixed())

    //convert amount to 10^45;

    // const collateralAmount = '50000000000000000000';
    // const highestBid = '1000000000000000000000000000000000000000000000';
    const tend = await this._flipperContract().tend(id, lotSizeInWei, bidAmountRad.toFixed());
    console.log('tend in service', tend);
  }

  async getAuction(id) {
    console.log('fetching', id);
    try {
      return await this._flipperContract().bids(id);
    } catch(err) {

    }
  }

  _flipperContract({ web3js = false } = {}) {
    return this.get('smartContract').getContractByName('FLIPPER');
  }
}