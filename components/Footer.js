/** @jsx jsx */

import React, { useState } from 'react';
import {
  Heading,
  Text,
  jsx,
  Button,
  Grid,
  Box,
  Styled,
  Label,
  Input,
  Flex,
  NavLink
} from 'theme-ui';
import Link from 'next/link';



const Footer = () => {
  return (
<Flex
          as="nav"
          sx={{
            ml: [0, 'auto'],
            width: '100%',
            justifyContent: 'flex-end'
            // mr: [null, 6]
          }}
        >
          <Link href="/terms">
            <NavLink
              p={2}
              variant="footer"
              sx={{
                // px: [4, 6],
                pr: 0
              }}
            >
              Terms
            </NavLink>
          </Link>
    </Flex>
  )
}

export default Footer;
