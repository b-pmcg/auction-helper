/** @jsx jsx */

import React, { useState, useEffect } from 'react';
import {
  Heading,
  Text,
  jsx,
  Box,
  Button,
  Grid,
  Styled,
  Input,
  Flex
} from 'theme-ui';

const ActionTabs = ({ actions }) => {
  const f = actions.filter(Boolean);
  const tabs = f.map(a => a[0]);
  const contents = f.map(a => a[1]);
  const active = f.map(a => a[2]).indexOf(true);
  const [activeTabIndex, setActive] = useState(active >= 0 ? active : null);

  return (
    <Grid>
      <Flex>
        {tabs.map((t, i) => (
          <Button
            variant={i !== activeTabIndex ? 'pillInactive' : 'pill'}
            sx={{
              mr: 2
            }}
            onClick={() => {
              setActive(i);
            }}
          >
            {t}
          </Button>
        ))}
      </Flex>
      <Box>
        {activeTabIndex >= 0 &&
        activeTabIndex < contents.length &&
        contents[activeTabIndex]
          ? contents[activeTabIndex]
          : null}
      </Box>
    </Grid>
  );
};

export default ActionTabs;
