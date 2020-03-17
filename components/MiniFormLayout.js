/** @jsx jsx */

import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
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
  Flex
} from 'theme-ui';

const MiniFormLayout = ({
  text,
  disabled,
  actionText,
  inputUnit,
  inputType = 'number',
  onSubmit,
  error,
  small
}) => {
  const [inputState, setInputState] = useState(undefined);
  const _disabled = disabled || !inputState;

  const _onSubmit = () => {
    onSubmit(inputState);
  };

  const handleInputChange = event => {
    const value = event.target.value;
    // const state = { amount: undefined, error: undefined };

    setInputState(BigNumber(value));
    // if (value) {
    // state.amount = new BigNumber(value);

    // if (state.amount.lt(maxBid)) {
    //   state.error = 'Your bid is too low, you will need to increase.';
    // }
    // }

    // setState(state);
  };
  return (
    <Grid gap={2}>
      <Text variant="boldBody">{text}</Text>
      <Flex
        sx={{
          flexDirection: ['column', 'row']
        }}
      >
        <Flex
          sx={{
            maxWidth: ['100%', '224px'],
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            bg: 'white',
            borderRadius: 6,
            fontSize: 4,
            // lineHeight: '24px',
            py: 3,
            px: 5
          }}
        >
          <Input
            sx={{
              border: 'none',
              outline: 'none',
              p: 0,
              marginRight: '2'
            }}
            id="big-amount"
            type={inputType}
            step="0.01"
            placeholder="0"
            onChange={handleInputChange}
          />
          {inputUnit ? (
            <Label sx={{ p: 0, width: 'auto' }} htmlFor="bid-amount">
              {inputUnit}
            </Label>
          ) : null}
        </Flex>
        <Button
          sx={{ ml: [0, 2], mt: [2, 0] }}
          variant="primary"
          disabled={_disabled}
          onClick={_onSubmit}
        >
          {actionText}
        </Button>
      </Flex>
      {error && <Text variant="smallDanger">{error}</Text>}
      <Text variant="small">{small}</Text>
    </Grid>
  );
};

export default MiniFormLayout;
