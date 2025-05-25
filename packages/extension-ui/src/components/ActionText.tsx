// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  icon?: IconDefinition;
  onClick: MouseEventHandler<HTMLDivElement>;
  text: string;
}

function ActionText ({ className, icon, onClick, text }: Props): React.ReactElement<Props> {
  return (
    <div
      className={className}
      onClick={onClick}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      <span>{text}</span>
    </div>
  );
}

export default styled(ActionText)<Props>`
  cursor: pointer;

  span {
    color: var(--labelColor);
    font-size: var(--labelFontSize);
    line-height: var(--labelLineHeight);
    text-decoration-line: underline;
  }

  .svg-inline--fa {
    color: var(--iconNeutralColor);
    display: inline-block;
    margin-right: 0.3rem;
    position: relative;
    top: 2px;
  }
`;
