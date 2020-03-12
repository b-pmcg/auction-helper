import { PublicService } from '@makerdao/services-core';

export default class ValidatorService extends PublicService {
  constructor(name = 'validator') {
    super(name, ['web3', 'smartContract']);
    this.queryPromises = {};
    this.staging = false;
    this.id = 123
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

  initialize(settings) {
    console.log('settings', settings);
    this._url = 'https://api.prylabs.net';
    // this._url = 'http://rancher.local:4001';
  }


  async getValidatorInfo(index) {
    const route = `eth/v1alpha1/validator?index=${index}`;
    const response = await this.request(route, 'GET');
    console.log('response', this._flipperContract);
  }

  async getBid() {
    // const bidId = 2590;
    const bid = await this._flipperContract().bids(this.id)
    console.log('bid', bid);
    const lotSize = bid[0]
    return lotSize;
    // console.log('bid in service', bid);
  }
  //tend(uint id, uint lot, uint bid)
  async tend( ) {
    // const auctionId = 2590;
    //auctionId, collateralAmount, highestBid
    console.log('calling tend')
    const lotSize = await this.getBid();
    console.log('lotSize', lotSize)
    const lotSizeInWei = this.get('web3')._web3.utils.toWei(lotSize.toString());

    console.log('lotSizeInWei', lotSizeInWei)
    // const collateralAmount = '50000000000000000000';
    // const collateralAmount = 1224000000000000000;
    const highestBid = '1000000000000000000000000000000000000000000000';
    const tend = await this._flipperContract().tend(this.id, lotSizeInWei, highestBid);
    console.log('tend in service', tend);
  }

  async getBlockNumber(id) {
    const { details: chain } = await this.getChain(id);

    if (chain.status !== 'ready') {
      return null;
    } else {
      const url = this._parseChainUrl(chain);
      const res = await this.request(
        '',
        'POST',
        url,
        '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
      );
      if (res && res.result) return parseInt(res.result, 16);
    }
  }

  _flipperContract({ web3js = false } = {}) {
    // if (web3js) return this.get('smartContract').getWeb3ContractByName('FLIPPER');
    return this.get('smartContract').getContractByName('FLIPPER');
  }
  
  // async getValidatorInfo(index) {
  //   const route = `eth/v1alpha1/validator?index=${index}`;
  //   const response = await this.request(route, 'GET');
  //   console.log('response', response);
  // }
}