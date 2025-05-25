// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExpand, faTasks } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import settings from '@polkadot/ui-settings';

import {
  ActionContext,
  ActionText,
  Checkbox,
  chooseTheme,
  Dropdown,
  Menu,
  MenuDivider,
  MenuItem,
  Switch,
  ThemeSwitchContext
} from '../components';
import useIsPopup from '../hooks/useIsPopup';
import useTranslation from '../hooks/useTranslation';
import { windowOpen } from '../messaging';
import getLanguageOptions from '../util/getLanguageOptions';

interface Option {
  text: string;
  value: string;
}

interface Props {
  className?: string;
  reference: React.MutableRefObject<null>;
}

// CENNZnet only for now
const prefixOptions: Option[] = [({ text: 'CENNZnet', value: '42' }) as Option];

function MenuSettings ({ className, reference }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [camera, setCamera] = useState(settings.camera === 'on');
  const [prefix, setPrefix] = useState(`${settings.prefix === -1 ? 42 : settings.prefix}`);
  const [theme, setTheme] = useState(chooseTheme());
  const setThemeContext = useContext(ThemeSwitchContext);
  const isPopup = useIsPopup();
  const languageOptions = useMemo(() => getLanguageOptions(), []);
  const onAction = useContext(ActionContext);

  useEffect(() => {
    settings.set({ camera: camera ? 'on' : 'off' });
  }, [camera]);

  const _onChangePrefix = useCallback(
    (value: string): void => {
      setPrefix(value);
      settings.set({ prefix: parseInt(value, 10) });
    },
    []
  );

  const _onWindowOpen = useCallback(
    () => windowOpen('/'),
    []
  );

  const _onChangeLang = useCallback(
    (value: string): void => {
      settings.set({ i18nLang: value });
    },
    []
  );

  const _onSetTheme = useCallback(
    (checked: boolean): void => {
      const theme = checked ? 'dark' : 'light';

      setThemeContext(theme);
      setTheme(theme);
    },
    [setThemeContext]
  );


  const _goToAuthList = useCallback(
    () => {
      onAction('auth-list');
    }, [onAction]
  );

  return (
    <Menu
      className={className}
      reference={reference}
    >
      <MenuItem
        className='setting'
        title='Theme'
      >
        <Switch
          checked={theme === 'dark'}
          checkedLabel={t<string>('Dark')}
          onChange={_onSetTheme}
          uncheckedLabel={t<string>('Light')}
        />
      </MenuItem>
      <MenuDivider />
      <MenuItem className='setting'>
        <ActionText
          className='manageWebsiteAccess'
          icon={faTasks}
          onClick={_goToAuthList}
          text={t<string>('Manage Website Access')}
        />
      </MenuItem>
      <MenuDivider/>
      <MenuItem
        className='setting'
        title={t<string>('External accounts and Access')}
      >
        <Checkbox
          checked={camera}
          className='checkbox camera'
          label={t<string>('Allow QR Camera Access')}
          onChange={setCamera}
        />
      </MenuItem>
      <MenuDivider />
      <MenuItem
        className='setting'
        title={t<string>('Display address format for')}
      >
        <Dropdown
          className='dropdown'
          label=''
          onChange={_onChangePrefix}
          options={prefixOptions}
          value={`${prefix}`}
        />
      </MenuItem>
      <MenuDivider />
      <MenuItem
        className='setting'
        title={t<string>('Language')}
      >
        <Dropdown
          className='dropdown'
          label=''
          onChange={_onChangeLang}
          options={languageOptions}
          value={settings.i18nLang}
        />
      </MenuItem>
      {isPopup && (
        <>
          <MenuDivider />
          <MenuItem className='setting'>
            <ActionText
              className='openWindow'
              icon={faExpand}
              onClick={_onWindowOpen}
              text={t<string>('Open extension in new window')}
            />
          </MenuItem>
        </>
      )}
    </Menu>
  );
}

export default React.memo(styled(MenuSettings)<Props>`
  margin-top: 50px;
  right: 24px;
  user-select: none;

  .openWindow, .manageWebsiteAccess{
    span {
      color: var(--textColor);
      font-size: var(--fontSize);
      line-height: var(--lineHeight);
      text-decoration: none;
      vertical-align: middle;
    }

    .Comp--Svg {
      background: var(--textColor);
      height: 20px;
      top: 4px;
      width: 20px;
    }
  }

  > .setting {
    > .checkbox {
      color: var(--textColor);
      line-height: 20px;
      font-size: 15px;
      margin-bottom: 0;

      &.ledger {
        margin-top: 0.2rem;
      }

      label {
        color: var(--textColor);
      }
    }

    > .dropdown {
      background: var(--background);
      margin-bottom: 0;
      margin-top: 9px;
      margin-right: 0;
      width: 100%;
    }
  }
`);
