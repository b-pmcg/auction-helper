import React from 'react';
import App from 'next/app';
import MakerProvider from '../providers/MakerProvider';
import { ThemeProvider, Styled, Box } from 'theme-ui';
import theme from '../theme';
import Header from '../components/Header';
import ReactGA from 'react-ga';
import {sysAPI} from '../stores/systemStore';

class MyApp extends App {
  state = {
    network: ''
  };

  componentDidMount() {
  const setFeatureFlag = sysAPI.getState().setFeatureFlag;

    this.setState({
      network: window.location.search.includes('kovan') ? 'kovan' : 'mainnet'
    });

    if (window && window.location.search.includes('show-test-ui')) {
      setFeatureFlag('alpha-ui')
    }

    if (window !== undefined) {
      ReactGA.initialize('UA-65766767-8');
      // ReactGA.pageview(window.location.pathname + window.location.search);
    }
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
