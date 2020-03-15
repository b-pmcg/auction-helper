/** @jsx jsx */

import { Heading, Text, jsx, Button, NavLink, Box, Flex } from 'theme-ui';
import Link from 'next/link';
import useMaker from '../hooks/useMaker';
import GuttedLayout from './GuttedLayout';
import Logo from './Logo';
export default () => {
  const { maker, network, web3Connected, setWeb3Connected } = useMaker();

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

  // autoConnect();

  const formatAccountAddress = address =>
    address.slice(0, 7) + '...' + address.slice(-4);

  return (
    <GuttedLayout>
      <Flex
        sx={{
          py: 3,
          justifyContent: ['center', 'flex-start'],
          flexWrap: ['wrap', 'nowrap']
        }}
      >
        <Link href="/">
          <Flex
            sx={{
              mr: 'auto',
              alignItems: 'center',
              py: 2
            }}
          >
            <Logo />
          </Flex>
        </Link>
        <Flex
          as="nav"
          px={{
            ml: [0, 'auto']
          }}
        >
          <Link href="/flip">
            <NavLink p={2}>Collateral auctions</NavLink>
          </Link>
          <Link href="/flop">
            <NavLink
              p={2}
              sx={{
                px: 4
              }}
            >
              Debt auctions
            </NavLink>
          </Link>
        </Flex>
        <Flex
          sx={{
            mt: [2, 0],
            width: ['100%', 'auto'],
            justifyContent: ['center', '']
          }}
        >
          {!web3Connected ? (
            <Button
              variant="primary"
              disabled={!maker}
              onClick={connectBrowserWallet}
              sx={{
                width: ['100%', 'auto']
              }}
            >
              Connect Wallet
            </Button>
          ) : (
            <Flex
              sx={{
                p: 2,
                bg: 'white',
                px: 4,
                py: 3,
                fontSize: 2,
                lineHeight: '20px',
                width: '296px',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'border',
                borderRadius: 4,
                color: 'blackThree'
              }}
            >
              <Flex
                sx={{
                  flex: '1 1 auto'
                }}
              >
                <span
                  sx={{
                    color: network === 'mainnet' ? 'primary' : 'purple',
                    marginRight: 2
                  }}
                >
                  ●
                </span>
                <Text>Metamask</Text>
              </Flex>
              <Text>{formatAccountAddress(maker.currentAddress())}</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </GuttedLayout>
  );
};
