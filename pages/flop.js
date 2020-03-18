/** @jsx jsx */
import { useState, useEffect, useLayoutEffect } from 'react';
import Head from 'next/head';
import useMaker from '../hooks/useMaker';

import * as _ from 'lodash';
import { Text, jsx, Flex, Heading, Grid, Box, Spinner, Button } from 'theme-ui';
import AccountManager from '../components/FlopAccountManager';
import GuttedLayout from '../components/GuttedLayout';
import AuctionsLayout from '../components/AuctionsLayout';
import IntroInfoCard from '../components/IntroInfoCard';
import IntroMDX from '../text/flopIntro.mdx';
import Footer from '../components/Footer';
import TermsConfirm from '../components/TermsConfirm';
import Moment from 'react-moment';
import useAuctionsStore, {selectors} from '../stores/auctionsStore';

export const useTOC = () => {
  const [value, setValue] = useState('false');
  useEffect(() => {
    const value = localStorage.getItem('toc');
    if(value !== null) {
      setValue(value);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('toc', value);
  }, [value]);
  return [value === 'true', () => setValue('true')];
};

const Index = () => {
  const { maker, web3Connected } = useMaker();
  const auctions = useAuctionsStore(state => state.auctions);
  const fetchAuctions = useAuctionsStore(state => state.fetchAll);
  const fetchAuctionsSet = useAuctionsStore(state => state.fetchSet);
  const fetchFlopStepSize = useAuctionsStore(state => state.fetchFlopStepSize);
  const stepSize = useAuctionsStore(state => state.flopStepSize);
  const [TOCAccepted, setTOCAccepted] = useTOC();
  const [{isSyncing, lastSynced}, sync] = useState({})

  useEffect(() => {
    if (web3Connected) {
      if (!auctions) {
        fetchAuctions(maker);
        fetchFlopStepSize(maker);
      }
    }
  }, [web3Connected]);

  useEffect(() => {
      if(isSyncing) {
        sync({
          lastSynced,
          isSyncing:false
        })
      } ;
  }, [auctions])

  return (
    <GuttedLayout>
      <Head>
        <title>Debt Auctions - Maker Auctions</title>
      </Head>
      {!maker ? (
        <Flex
          sx={{
            justifyContent: 'center',
            p: 8
          }}
        >
          <Spinner />
        </Flex>
      ) : (
        <>
          <Heading
            variant="h1"
            sx={{
              py: 7
            }}
          >
            Debt Auctions
          </Heading>

          <IntroInfoCard
            title={'How do debt auctions work?'}
            text={<IntroMDX />}
            forceExpanded={!TOCAccepted}
            action={
              TOCAccepted ? null : (
                <TermsConfirm
                  onConfirm={setTOCAccepted}
                />
              )
            }
          />
          <Box
            sx={{
              opacity: TOCAccepted ? 1 : 0.2,
              pointerEvents: TOCAccepted ? 'auto' : 'none'
            }}
          >
            <AccountManager web3Connected={web3Connected} />

            {!web3Connected ? null : (
              <Flex
                sx={{
                  py: 4,
                  alignItems: 'center'
                }}
              >
                <Text variant="h2">Active Auctions</Text>
                {
                  isSyncing
                    ? <Spinner
                        sx={{
                          height: 7,
                          ml: 5
                        }}
                      />
                    : <Button
                        variant="pill"
                        sx={{ ml: 5 }}
                        disabled={!web3Connected}
                        onClick={() => { sync({isSyncing: true, lastSynced: new Date()}); fetchAuctions(maker) }}
                       >
                      Sync
                    </Button>
                }

                {lastSynced && (
                  <Text title={lastSynced} sx={{ ml: 5, fontSize: 2 }}>
                    (Last synced: <Moment local>{lastSynced.getTime()}</Moment>)
                  </Text>
                )}
              </Flex>
            )}
            {!web3Connected ? null : !auctions ? (
              <Flex
                sx={{
                  justifyContent: 'center'
                }}
              >
                <Spinner />
              </Flex>
            ) : !Object.keys(auctions).length ? (
              <Flex>
                <Text variant="boldBody">
                  No auctions found, check back later.
                </Text>
              </Flex>
            ) : (
              <AuctionsLayout
                stepSize={stepSize}
                auctions={auctions}
                type="flop"
              />
            )}
          </Box>
        </>
      )}
      {/* </Box> */}
      <Footer />
    </GuttedLayout>
  );
};

export default Index;
