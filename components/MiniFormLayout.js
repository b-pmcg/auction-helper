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
  buttonOnly,
  inputUnit,
  inputType = 'number',
  onSubmit,
  inputValidation,
  onChange,
  error,
  small
}) => {
  const [inputState, setInputState] = useState(undefined);

  const errors =
    (!buttonOnly && !inputState) || !inputValidation
      ? []
      : inputValidation
          .map(([test, ...rest]) => {
            return [test(inputState), ...rest];
          })
          .filter(([res]) => res);
  const errorMessages = errors.map(([res, text]) => text).filter(Boolean);

  const _disabled = disabled || (!buttonOnly && !inputState) || !!errors.length;

  const _onSubmit = () => {
    onSubmit(inputState);
  };

  const handleInputChange = event => {
    const value = event.target.value;
    // const state = { amount: undefined, error: undefined };

    if (onChange) onChange(BigNumber(value));
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
        {!buttonOnly ? (
          <Flex
            sx={{
              maxWidth: ['100%', '224px'],
              mr: [0, 2],
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
        ) : null}
        <Button
          sx={{ mt: [2, 0] }}
          variant="primary"
          disabled={_disabled}
          onClick={_onSubmit}
        >
          {actionText}
        </Button>
      </Flex>
      {!errorMessages
        ? null
        : errorMessages.map(err => <Text variant="smallDanger">{err}</Text>)}
      <Text variant="small">{small}</Text>
    </Grid>
  );
};

export default MiniFormLayout;
