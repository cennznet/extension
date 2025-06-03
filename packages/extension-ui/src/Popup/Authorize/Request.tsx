// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RequestAuthorizeTab } from '@cennznet/extension-base/background/types';

import React, { useCallback, useContext } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';

import { ActionBar, ActionContext, Button, Icon, Link, Warning } from '../../components';
import useTranslation from '../../hooks/useTranslation';
import { approveAuthRequest, rejectAuthRequest } from '../../messaging';

interface Props {
  authId: string;
  className?: string;
  isFirst: boolean;
  request: RequestAuthorizeTab;
  url: string;
}

function Request ({ authId, className, isFirst, request: { origin }, url }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const onAction = useContext(ActionContext);

  const _onApprove = useCallback(
    () => approveAuthRequest(authId)
      .then(() => onAction())
      .catch((error: Error) => console.error(error)),
    [authId, onAction]
  );

  const _onReject = useCallback(
    () => rejectAuthRequest(authId)
      .then(() => onAction())
      .catch((error: Error) => console.error(error)),
    [authId, onAction]
  );

  return (
    <div className={className}>
      <div className='requestInfo'>
        <div className='info'>
          <Icon
            icon='X'
            onClick={_onReject}
          />
          <div className='tab-info'>
            <Trans key='accessRequest'>An application, self-identifying as <span className='tab-name'>{origin}</span> is requesting access from{' '}
              <a
                href={url}
                rel='noopener noreferrer'
                target='_blank'
              >
                <span className='tab-url'>{url}</span>
              </a>.
            </Trans>
          </div>
        </div>
        {isFirst && (
          <>
            <Warning className='warningMargin'>
              {t<string>('Only approve this request if you trust the application. Approving gives the application access to the addresses of your accounts.')}
            </Warning>
            <Button
              className='acceptButton'
              onClick={_onApprove}
            >
              {t<string>('Yes, allow this application access')}
            </Button>
          </>
        )}
        <ActionBar className='rejectionButton'>
          <Link
            isDanger
            onClick={_onReject}
          >
            Reject
          </Link>
        </ActionBar>
      </div>
    </div>
  );
}

export default styled(Request)<Props>`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;

  .footer {
    padding: 1rem 1rem 0rem 1rem;
    background: var(--background);
  }

  .buttonContainer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .acceptButton, .rejectButton {
    width: 48%;
    height: 40px;
  }

  .dontAskAgainContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    input {
      margin-right: 0.5rem;
    }
  }
`;
