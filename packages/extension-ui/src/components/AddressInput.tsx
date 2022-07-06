// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// Copyright 2021 @cennznet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { InputWithLabel, Warning } from '@cennznet/extension-ui/components/index';
import useTranslation from '@cennznet/extension-ui/hooks/useTranslation';
import { decodeAddress } from '@polkadot/util-crypto';

interface Props {
  className?: string;
  defaultValue?: string;
  label: string;
  placeholder?: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  value?: string | null;
}

function AddressInput ({ className, defaultValue, label, placeholder, onBlur, onChange, onEnter, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [address, setAddress] = useState(value || defaultValue || '');
  const [error, setError] = useState('');

  useEffect(() => {
    const _setAddress = (address: string): void => {
      setError('');

      onChange && onChange(address);
    }

    if (!address) {
      _setAddress('');
      return;
    }

    try {
      decodeAddress(address);

      _setAddress(address);
    } catch (e) {
      setError(t<string>('Invalid address'));

      onChange && onChange('');
    }
  }, [address]);

  return (
    <div className={className}>
      <InputWithLabel
        defaultValue={defaultValue}
        label={label}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={setAddress}
        onEnter={onEnter}
        value={address}
      />
      {!!error && (
        <Warning
          isBelowInput
          isDanger
        >
          {error}
        </Warning>
      )}
    </div>
  );
}

export default AddressInput;
