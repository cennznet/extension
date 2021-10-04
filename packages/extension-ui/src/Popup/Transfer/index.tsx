// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// Copyright 2021 @cennznet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { BN } from '@cennznet/util';
import { isChainSupported } from '@cennznet/extension-base/api';

import {
  AccountContext,
  AmountInput,
  Address,
  AddressInput, Button, ButtonArea,
  Dropdown,
  Loading,
  VerticalSpace, InputWithLabel, Warning, ActionContext,
} from '../../components';
import useGenesisHashOptions from '../../hooks/useGenesisHashOptions';
import useToast from '../../hooks/useToast';
import useTranslation from '../../hooks/useTranslation';
import { Header } from '../../partials';
import { findAccountByAddress } from '../../util/accounts';
import { transfer } from '../../messaging';

interface Props {
  className?: string;
}

interface AddressState {
  address: string;
}

const MIN_LENGTH = 6;

function Transfer ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const genesisHashOptions = useGenesisHashOptions();
  const [genesis, setGenesis] = useState('');
  const [to, setTo] = useState('');
  const [asset, setAsset] = useState('cennz');
  const [amount, setAmount] = useState<BN | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [pass, setPass] = useState('');
  const [passError, setPassError] = useState('');
  const [error, setError] = useState('');
  const { address } = useParams<AddressState>();
  const { accounts } = useContext(AccountContext);
  const onAction = useContext(ActionContext);
  const { show } = useToast();

  const networkOptions = genesisHashOptions.filter(option => isChainSupported(option.value, false));
  const account = findAccountByAddress(accounts, address);
  if (!account) {
    throw new Error(t<string>('Account not found!'));
  }

  const _onTransfer = (): void => {
    setIsBusy(true);

    transfer(account.genesisHash || genesis, address, to, asset, amount ? amount.toString() : '0', pass).then((txid: string) => {
      console.log(txid);

      show(`${t<string>('Transaction sent!')}`);

      setTo('');
      setAmount(null);

      setTimeout(() => {
        onAction('/');
      }, 2000);
    }).catch(error => {
      const message = error.toString();
      if (message === 'Error: Unable to decode using the supplied passphrase') {
        setPassError('Wrong password');
      } else {
        setError(message);
      }
    }).finally(() => {
      setIsBusy(false);
    });
  };

  const _onPassChange = (password: string) => {
    setPass(password);
    setPassError('');
  };

  const _removeError = () => setError('');

  return (
    <>
      <Header
        showBackArrow
        text={t<string>('Transfer')}
      />
      <Loading>
        <div className={className}>
          <div>
            <Address
              address={address}
              genesisHash={genesis || account?.genesisHash}
              showBalances={true}
            />
          </div>
          {!account.genesisHash && (
            <Dropdown
              className="dropdown"
              isDisabled={isBusy}
              label={t<string>('Select network')}
              onChange={(genesis: string) => {
                setGenesis(genesis);
                _removeError();
              }}
              options={networkOptions}
              value={genesis}
            />
          )}
          <AddressInput
            label={t<string>('Send to address')}
            onChange={(address: string) => {
              setTo(address);
              _removeError();
            }}
            value={to}
          />
          <Dropdown
            className="dropdown"
            isDisabled={isBusy}
            label={t<string>('Asset type')}
            onChange={(asset: string) => {
              setAsset(asset);
              _removeError();
            }}
            options={[
              { value: 'cennz', text: 'CENNZ' },
              { value: 'cpay', text: 'CPAY' },
            ]}
            value={asset}
          />
          <AmountInput
            disabled={isBusy}
            label={t<string>('Send amount')}
            onChange={amount => {
              setAmount(amount);
              _removeError();
            }}
            placeholder="0.0000"
            value={amount}
          />
          <InputWithLabel
            disabled={isBusy}
            isError={pass.length < MIN_LENGTH || !!passError}
            label={t<string>('password for this account')}
            onChange={_onPassChange}
            type="password"
          />
          {passError && (
            <Warning
              isBelowInput
              isDanger
            >
              {passError}
            </Warning>
          )}
          {error && (
            <Warning
              isBelowInput
              isDanger
            >
              {error}
            </Warning>
          )}
        </div>
        <VerticalSpace/>
        <ButtonArea>
          <Button
            isBusy={isBusy}
            isDisabled={!to || !amount || pass.length < MIN_LENGTH || !!passError}
            onClick={_onTransfer}
          >
            {t<string>('Send funds')}
          </Button>
        </ButtonArea>
      </Loading>
    </>
  );
}

export default styled(Transfer)`
  .dropdown {
    margin-bottom: 16px;
  }
`;
