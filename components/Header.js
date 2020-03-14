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

  return (
    <GuttedLayout>
      <Flex sx={{ p: 3, justifyContent: 'flex-start' }}>
        <Link href="/">
          <Box
            sx={{
              mr: 'auto',
              p:2
            }}
          >
            <Logo />
          </Box>
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
          <Box 
            sx={{
              p: 2
            }}
          >
            <Text>{maker.currentAddress()}</Text>
          </Box>
        )}
      </Flex>
    </GuttedLayout>
  );
};
