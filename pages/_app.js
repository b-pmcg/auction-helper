import React from 'react';
import App from 'next/app';
import MakerProvider from '../providers/MakerProvider';
import { ThemeProvider, Styled, Box } from 'theme-ui';
import theme from '../theme';
import Header from '../components/Header';
class MyApp extends App {
  state = {
    network: ''
  };

  componentDidMount() {
    this.setState({
      network: window.location.search.includes('kovan') ? 'kovan' : 'mainnet'
    });
  }

  render() {
    const { Component, pageProps } = this.props;
    const { network } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <Styled.root>
          <MakerProvider network={network}>
            <Header />
            <Box pt={4}>
              <Component {...pageProps} />
            </Box>
          </MakerProvider>
        </Styled.root>
      </ThemeProvider>
    );
  }
}

export default MyApp;
