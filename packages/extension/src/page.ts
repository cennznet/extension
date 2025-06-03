// Copyright 2019-2021 @polkadot/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Message } from '@cennznet/extension-base/types';

import { RequestSignatures, TransportRequestMessage } from '@cennznet/extension-base/background/types';
import { MESSAGE_ORIGIN_CONTENT } from '@cennznet/extension-base/defaults';
import { enable, handleResponse, redirectIfPhishing } from '@cennznet/extension-base/page';
import { injectExtension } from '@cennznet/extension-inject';

import { packageInfo } from './packageInfo';

// setup a response listener (events created by the loader for extension responses)
window.addEventListener('message', ({ data, source }: Message): void => {
  // only allow messages from our window, by the loader
  if (source !== window || data.origin !== MESSAGE_ORIGIN_CONTENT) {
    return;
  }

  if (data.id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleResponse(data as TransportRequestMessage<keyof RequestSignatures>);
  } else {
    console.error('Missing id for response.');
  }
});

inject();
redirectIfPhishing().catch((e) => console.warn(`Unable to determine if the site is in the phishing list: ${(e as Error).message}`));

function inject () {
  injectExtension(enable, {
    name: 'cennznet-extension',
    version: packageInfo.version
  });
}
