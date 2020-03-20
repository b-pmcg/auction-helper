/** @jsx jsx */

import React, { useState, useEffect } from 'react';
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
import { TX_PENDING, TX_SUCCESS, TX_ERROR, ZERO } from '../constants';
import useAuctionsStore, { selectors } from '../stores/auctionsStore';

const MiniFormLayout = ({
  text,
  disabled,
  actionText,
  buttonOnly,
  inputUnit,
  inputType = 'number',
  onSubmit,
  onChange,
  inputValidation,
  onTxFinished,
  onMount,
  small
}) => {
  const fetchAuctions = useAuctionsStore(state => state.fetchAll);
  const [inputState, setInputState] = useState(undefined);
  const [txState, setTxState] = useState(undefined);
  const [txMsg, setTxMsg] = useState(undefined);
  const [txErrorMsg, setTxErrorMsg] = useState(undefined);

  const errors =
    (!buttonOnly && !inputState) || !inputValidation
      ? []
      : inputValidation
          .map(([test, ...rest]) => {
            return [test(inputState), ...rest];
          })
          .filter(([res]) => res);
  const errorMessages = errors.map(([res, text]) => text).filter(Boolean);
  if (txErrorMsg) {
    errorMessages.push(txErrorMsg);
  }

  // console.log(txState === TX_PENDING)

  const _disabled =
    disabled ||
    (!buttonOnly && !inputState) ||
    (inputState && inputState.eq(ZERO)) ||
    !!errors.length ||
    txState === TX_PENDING;

  const _onSubmit = () => {
    const txObject = onSubmit(inputState);
    setTxErrorMsg(undefined);
    maker.service('transactionManager').listen(txObject, {
      initialized: () => {
        setTxState(TX_PENDING);
      },
      pending: tx => {
        setTxState(TX_PENDING);
        setTxMsg(
          'Please wait while the transaction is being mined (this can take a while)'
        );
      },
      mined: tx => {
        setTxState(TX_SUCCESS);
        setTxMsg('Transaction Sucessful!');
        setInputState(undefined);
        if (onTxFinished) onTxFinished(TX_SUCCESS);
      },
      error: (_, err) => {
        const errorMsg = _.error.message.split('\n')[0];
        setTxState(TX_ERROR);
        setTxMsg(null);

        setTxErrorMsg(`Transaction failed with error: ${errorMsg}`);
        if (onTxFinished) onTxFinished(TX_ERROR);
      }
    });
    return txObject;
  };

  const handleInputChange = event => {
    const value = event.target.value;
    setInputState(BigNumber(value));
  };

  useEffect(() => {
    if (onChange) onChange(BigNumber(inputState));
  });

  return (
    <Grid gap={2}>
      <Text>{text}</Text>
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
              value={inputState ? inputState.toNumber() : inputState}
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
          {txState === TX_PENDING ? 'Waiting for Transaction' : actionText}
        </Button>
      </Flex>
      {!errorMessages
        ? null
        : errorMessages.map(err => <Text variant="smallDanger">{err}</Text>)}
      <Text variant="small">
        {typeof small === 'function' ? small(inputState) : small}
      </Text>
      {txMsg ? (
        <Text
          variant="small"
          sx={{
            color: 'primary'
          }}
        >
          {txMsg}
        </Text>
      ) : null}
    </Grid>
  );
};

export default MiniFormLayout;
