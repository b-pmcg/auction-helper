import React from 'react';
import App from 'next/app';
import MakerProvider from '../providers/MakerProvider';

class MyApp extends App {
  state = {};

  componentDidMount() {
    this.setState({
      network: window.location.search.includes('kovan') ? 'kovan' : 'mainnet'
    });
  }

  render() {
    const { Component, pageProps } = this.props;
    const { network } = this.state;
    return (
      <MakerProvider network={network}>      
        <Component {...pageProps} />
      </MakerProvider>
    );
  }
}

export default MyApp;
