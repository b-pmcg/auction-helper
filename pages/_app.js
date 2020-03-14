import React from 'react';
import App from 'next/app';
import MakerProvider from '../providers/MakerProvider';
import { ThemeProvider, Styled, Box } from 'theme-ui';
import theme from '../theme';
import Header from '../components/Header';
class MyApp extends App {
  state = {
    web3Connected: false
  };

  componentDidMount() {
    this.setState({
      network: window.location.search.includes('kovan') ? 'kovan' : 'mainnet'
    });
  }

  setWeb3Connected = state => {
    this.setState({ web3Connected: state });
  };
  render() {
    const { Component, pageProps } = this.props;
    const { network, web3Connected } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <Styled.root>
          <MakerProvider network={network}>
            <Header
              web3Connected={web3Connected}
              setWeb3Connected={this.setWeb3Connected}
            />
            <Box pt={4}>
            <Component
              {...pageProps}
              web3Connected={web3Connected}
              setWeb3Connected={this.setWeb3Connected}
            />
            </Box>
          </MakerProvider>
        </Styled.root>
      </ThemeProvider>
    );
  }
}

export default MyApp;
