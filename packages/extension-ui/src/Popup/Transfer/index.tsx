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
  VerticalSpace,
} from '../../components';
import useGenesisHashOptions from '../../hooks/useGenesisHashOptions';
import useTranslation from '../../hooks/useTranslation';
import { Header } from '../../partials';
import { findAccountByAddress } from '../../util/accounts';

interface Props {
  className?: string;
}

interface AddressState {
  address: string;
}

function Transfer ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const genesisHashOptions = useGenesisHashOptions();
  const [genesis, setGenesis] = useState('');
  const [to, setTo] = useState('');
  const [asset, setAsset] = useState('cennz');
  const [amount, setAmount] = useState<BN | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const { address } = useParams<AddressState>();
  const { accounts } = useContext(AccountContext);

  const _onTransfer = (): void => {
    setIsBusy(true);
  };

  const networkOptions = genesisHashOptions.filter(option => isChainSupported(option.value, false));
  const account = findAccountByAddress(accounts, address);
  if (!account) {
    throw new Error(t<string>('Account not found!'));
  }

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
              label={t<string>('Network')}
              onChange={setGenesis}
              options={networkOptions}
              value={genesis}
            />
          )}
          <AddressInput
            label={t<string>('Send to address')}
            onChange={setTo}
            value={to}
          />
          <Dropdown
            className="dropdown"
            label={t<string>('Asset type')}
            onChange={setAsset}
            options={[
              { value: 'cennz', text: 'CENNZ' },
              { value: 'cpay', text: 'CPAY' },
            ]}
            value={asset}
          />
          <AmountInput
            label={t<string>('Send amount')}
            onChange={amount => setAmount(amount)}
            placeholder="0.0000"
            value={amount}
          />
        </div>
        <VerticalSpace/>
        <ButtonArea>
          <Button
            isBusy={isBusy}
            isDisabled={!to || !amount}
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
