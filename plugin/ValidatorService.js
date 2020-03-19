import { PublicService } from '@makerdao/services-core';
import tracksTransactions from './tracksTransactions';
import BigNumber from 'bignumber.js';
import { toRad, fromWei, toWei, fromWad } from './utils';
import * as gqlQueries from '../queries';
import getConfig from 'next/config';

export default class ValidatorService extends PublicService {
  flipAuctionsLastSynced = 0;
  flopAuctionsLastSynced = 0;
  backInTime = 1000 * 60 * 60 * 68; // 68 hours;

  constructor(name = 'validator') {
    super(name, ['web3', 'smartContract']);
    this.queryPromises = {};
    this.staging = false;

    this.id = 123;
  }

  async getQueryResponse(serverUrl, query, operationName, variables = {}) {
    const resp = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables,
        operationName
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

  async fetchFlipAuctions(shouldSync = false) {
    let currentTime = new Date().getTime();
    const timePassed = currentTime - this.flipAuctionsLastSynced;
    let queryDate = new Date();

    if (shouldSync) {
      queryDate = new Date(currentTime - timePassed);
    } else {
      queryDate = new Date(currentTime - this.backInTime);
    }

    this.flipAuctionsLastSynced = currentTime;

    return this.getAllAuctions({
      sources: [this.flipEthAddress, this.flipBatAddress],
      fromDate: queryDate
    });
  }

  async fetchFlopAuctions(shouldSync = false) {
    let currentTime = new Date().getTime();
    const timePassed = currentTime - this.flopAuctionsLastSynced;
    let queryDate = new Date();

    if (shouldSync) {
      queryDate = new Date(currentTime - timePassed);
    } else {
      queryDate = new Date(currentTime - this.backInTime);
    }

    this.flopAuctionsLastSynced = currentTime;
    return this.getAllAuctions({
      sources: [this.flopAddress],
      fromDate: queryDate
    });
  }

  async fetchFlopAuctionsByIds(ids) {
    let currentTime = new Date().getTime();
    const queryDate = new Date(currentTime - this.backInTime);

    const variables = {
      sources: [this.flopAddress],
      auctionIds: ids,
      fromDate: queryDate
    };

    const response = await this.getQueryResponse(
      this._cacheAPI,
      gqlQueries.specificAuctionEvents,
      'setAuctionsEvents',
      variables
    );

    // console.log('GraphQL response', response);
    return response.allLeveragedEvents.nodes;
  }

  async getAllAuctions(variables) {
    const response = await this.getQueryResponse(
      this._cacheAPI,
      gqlQueries.allAuctionEvents,
      'allAuctionsEvents',
      variables
    );
    // console.log('GraphQL response', response);
    return response.allLeveragedEvents.nodes;
  }

  initialize(settings) {
    console.log('settings', settings);
    this._url = 'https://api.prylabs.net';
  }

  connect() {
    this._cacheAPI = getConfig().publicRuntimeConfig[this.get('web3').networkName].CACHE_API;
  }

  async getLots(id) {
    const bids = await this._flipEthAdapter().bids(id);
    const lotSize = bids[0];
    return lotSize;
  }

  async flipEthTend(id, size, amount) {
    const lotSizeInWei = this.get('web3')._web3.utils.toWei(size.toString());
    const bidAmountRad = toRad(amount);

    console.log('id', id);
    console.log('lotSizeInWei', lotSizeInWei);
    console.log('bidAmountRad', bidAmountRad.toFixed());
    const tend = await this._flipEthAdapter().tend(
      id,
      lotSizeInWei,
      bidAmountRad.toFixed()
    );
    console.log('tend in service', tend);
  }

  async flipEthDent(id, size, amount) {
    const lotSizeInWei = this.get('web3')._web3.utils.toWei(size.toString());
    const bidAmountRad = toRad(amount);

    console.log('id', id);
    console.log('lotSizeInWei', lotSizeInWei);
    console.log('bidAmountRad', bidAmountRad.toFixed());

    const dent = await this._flipEthAdapter().dent(
      id,
      lotSizeInWei,
      bidAmountRad.toFixed()
    );
    console.log('dent in service', dent);
  }

  async flipEthDeal(id) {
    console.log('id', id);
    const deal = await this._flipEthAdapter().deal(id);
    console.log('^^^eth deal in service', deal);
  }

  async flipBatDeal(id) {
    console.log('id', id);
    const deal = await this._flipBatAdapter().deal(id);
    console.log('^^^bat deal in service', deal);
  }

  // FLOP
  @tracksTransactions
  async flopDent(id, lotSize, bidAmount, { promise }) {
    const lotSizeInWei = toWei(lotSize).toFixed();
    const bidAmountRad = toRad(bidAmount).toFixed();

    return this._flop().dent(id, lotSizeInWei, bidAmountRad, { promise });
  }

  @tracksTransactions
  async flopDeal(id, { promise }) {
    return this._flop().deal(id, { promise });
  }

  async getAuction(id) {
    console.log('fetching', id);
    try {
      return await this._flipEthAdapter().bids(id);
    } catch (err) {}
  }

  async getFlopDuration(id) {
    try {
      const flop = await this._flop().bids(id);
      return {
        end: new BigNumber(flop.end).times(1000),
        tic: flop.tic ? new BigNumber(flop.tic).times(1000) : new BigNumber(0)
      };
    } catch (err) {}
  }

  async getFlipDuration(id) {
    try {
      const flip = await this._flipEthAdapter().bids(id);
      return {
        end: new BigNumber(flip.end).times(1000),
        tic: flip.tic ? new BigNumber(flip.tic).times(1000) : new BigNumber(0)
      };
    } catch (err) {}
  }

  async getFlopStepSize() {
    const beg = await this._flop().beg();
    return fromWad(beg);
  }

  @tracksTransactions
  async joinDaiToAdapter(address, amount, { promise }) {
    await this._joinDaiAdapter().join(address, amount, { promise });
  }

  @tracksTransactions
  async exitDaiFromAdapter(address, amount, { promise }) {
    await this._joinDaiAdapter().exit(address, amount, { promise });
  }

  get flipEthAddress() {
    return this._flipEthAdapter().address;
  }

  get flipBatAddress() {
    return this._flipBatAdapter().address;
  }

  get flopAddress() {
    return this._flop().address;
  }

  get joinDaiAdapterAddress() {
    return this._joinDaiAdapter.address;
  }

  _flipEthAdapter({ web3js = false } = {}) {
    return this.get('smartContract').getContractByName('MCD_FLIP_ETH_A');
  }

  _flipBatAdapter() {
    return this.get('smartContract').getContractByName('MCD_FLIP_BAT_A');
  }

  _flop() {
    return this.get('smartContract').getContractByName('MCD_FLOP');
  }

  _joinDaiAdapter({ web3js = false } = {}) {
    return this.get('smartContract').getContractByName('MCD_JOIN_DAI');
  }
}
