/** @jsx jsx */

import { Heading, Text, jsx, Button, NavLink, Box, Flex } from 'theme-ui';
import Link from 'next/link';
import useMaker from '../hooks/useMaker';
import GuttedLayout from './GuttedLayout';
import Logo from './Logo';
export default ({ web3Connected, setWeb3Connected }) => {
  const { maker } = useMaker();

  async function connectBrowserWallet() {
    try {
      if (maker) {
        await maker.authenticate();
        setWeb3Connected(true);
      }
    } catch (err) {
      window.alert(err);
    }
  }

  const autoConnect = async () => {
    if (!web3Connected) {
      connectBrowserWallet();
    }
  };

  autoConnect();

 const formatAccountAddress = (address) => 
  address.slice(0, 7) + '...' + address.slice(-4) 
 

  return (
    <GuttedLayout>
      <Flex sx={{ p: 3, justifyContent: 'flex-start' }}>
        <Link href="/">
          <Flex
            sx={{
              mr: 'auto',
              alignItems: 'center',
              p:2
            }}
          >
            <Logo />
          </Flex>
        </Link>
        <Flex
          as="nav"
          px={{
            ml: 'auto'
          }}
        >
          <Link href="/flip">
            <NavLink p={2}>Flip Auctions</NavLink>
          </Link>
          <Link href="/flop">
            <NavLink p={2} sx={{
              px: 4
            }}>Flop Auctions</NavLink>
          </Link>
        </Flex>
        {!web3Connected ? (
          <Button onClick={connectBrowserWallet}>Connect Wallet</Button>
        ) : (
          <Flex sx={{
            p: 2,
            bg: 'background',
            px: 4,
            py: 3,    
            fontSize: 2,
            lineHeight: '20px',                
            width: '296px',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 4
          }}>
              <Flex sx={{
                flex: '1 1 auto'
              }}>
                <span  sx={{
                  color:'primary',
                  marginRight: 2
                }}>
                  ●
                </span>
                <Text>Metamask</Text>
              </Flex>
              <Text>{
                formatAccountAddress(maker.currentAddress())}
              </Text>
          </Flex>
        )}
      </Flex>
    </GuttedLayout>
  );
};
