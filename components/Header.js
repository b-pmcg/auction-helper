/** @jsx jsx */

import { Heading, Text, jsx, Button, NavLink, Box, Flex } from 'theme-ui';
import Link from 'next/link';
import useMaker from '../hooks/useMaker';

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
    <Flex sx={{ p: 10, justifyContent: 'flex-start' }}>
      <Link href="/">
        <Heading
          sx={{
            mr: 'auto'
          }}
        >
          Maker Auctions
        </Heading>
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
          <NavLink p={2}>Flop Auctions</NavLink>
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
  );
};
