// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { AuthUrlInfo } from '@cennznet/extension-base/background/handlers/State';
import { Switch } from '@cennznet/extension-ui/components';
import React, { useCallback } from 'react';
import styled from 'styled-components';

import useTranslation from '../../hooks/useTranslation';

interface Props {
  className?: string;
  info: AuthUrlInfo;
  toggleAuth: (url: string) => void
  url: string;
}

function WebsiteEntry ({ className = '', info, toggleAuth, url }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const switchAccess = useCallback(() => {
    toggleAuth(url);
  }, [toggleAuth, url]);

  return (
    <div className={`${className} ${info.isAllowed ? 'allowed' : 'denied'}`}>
      <div className='url'>
        {url}
      </div>
      <Switch
        checked={info.isAllowed}
        checkedLabel={t<string>('allowed')}
        className='info'
        onChange={switchAccess}
        uncheckedLabel={t<string>('denied')}
      />
    </div>
  );
}

export default styled(WebsiteEntry)<Props>`
  display: flex;
  align-items: center;
  margin-top: .2rem;

  .url{
    flex: 1;
  }

  .connectedAccounts{
    margin-left: .5rem;
    background-color: var(--primaryColor);
    color: white;
    cursor: pointer;
    padding: 0 0.5rem;
    border-radius: 4px;
    text-decoration: none;
  }
`;
