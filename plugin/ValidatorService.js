import { PublicService } from '@makerdao/services-core';

export default class ValidatorService extends PublicService {
  constructor(name = 'validator') {
    super(name, ['web3']);
    this.queryPromises = {};
    this.staging = false;
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

  // connect() {
  // }

  async getValidatorInfo(index) {
    const route = `eth/v1alpha1/validator?index=${index}`;
    const response = await this.request(route, 'GET');
    console.log('response', response);
  }
  
  // async getValidatorInfo(index) {
  //   const route = `eth/v1alpha1/validator?index=${index}`;
  //   const response = await this.request(route, 'GET');
  //   console.log('response', response);
  // }
}