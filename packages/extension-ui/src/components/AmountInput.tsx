// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// Copyright 2021 @cennznet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';
import { BN, BN_TEN, BN_ZERO } from '@cennznet/util';
import { InputWithLabel, Warning } from '@cennznet/extension-ui/components/index';
import useTranslation from '@cennznet/extension-ui/hooks/useTranslation';

interface Props {
  className?: string;
  decimals?: number;
  label: string;
  placeholder?: string;
  onChange?: (value: BN | null) => void;
  value?: BN | null;
}

const DEFAULT_DECIMALS = 4;
const MAX_VALUE = new BN(2).pow(new BN(128)).subn(1);

function inputToBn (input: string, decimals: number = DEFAULT_DECIMALS): BN {
  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  const isDecimalValue = input.match(/^(\d+)\.(\d+)$/);
  const power = new BN(decimals);

  let result;

  if (isDecimalValue) {
    const div = new BN(input.replace(/\.\d*$/, ''));
    const modString = input.replace(/^\d+\./, '').substr(0, decimals);
    const mod = new BN(modString);

    result = div
      .mul(BN_TEN.pow(power))
      .add(mod.mul(BN_TEN.pow(power.subn(modString.length))));
  } else {
    result = new BN(input.replace(/[^\d]/g, ''))
      .mul(BN_TEN.pow(power));
  }

  return result;
}

function bnValueToString (value?: BN | null): string {
  return value ? value.toString() : '';
}

function isValidAmount (bn: BN): boolean {
  if (
    // cannot be zero or negative
    bn.lte(BN_ZERO) ||
    // cannot be > than allowed max
    !bn.lt(MAX_VALUE)
  ) {
    return false;
  }

  return true;
}

function AmountInput ({ className, decimals = DEFAULT_DECIMALS, label, placeholder, onChange, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(bnValueToString(value) || '');
  const [error, setError] = useState('');
  const format = useMemo<RegExp>(() => RegExp(`^(?!0\\d)\\d*(\\.\\d{0,${decimals}})?$`), [decimals]);

  const _onChange = useCallback(
    (input: string) => {
      const _setAmount = (amount: BN | null, error: string = ''): void => {
        setError(error);

        onChange && onChange(amount);
      }

      setAmount(input);

      if (!input) {
        _setAmount(null);
        return;
      } else if (!input.match(format)) {
        _setAmount(null, t<string>('Invalid amount'));
        return;
      }

      const newAmount = inputToBn(input, decimals);
      if (isValidAmount(newAmount)) {
        _setAmount(newAmount);
      } else {
        _setAmount(null, t<string>('Invalid amount'));
      }
    },
    [decimals]
  );

  return (
    <div className={className}>
      <InputWithLabel
        label={label}
        placeholder={placeholder}
        onChange={_onChange}
        value={amount}
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

export default AmountInput;
