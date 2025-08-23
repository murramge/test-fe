import React from 'react';

import type { OptionType } from '@/components/ui';
import { Options, useModal } from '@/components/ui';
import { Moon, Sun, System } from '@/components/ui/icons';
import type { ColorSchemeType } from '@/lib';
import { translate, useSelectedTheme } from '@/lib';

import { Item } from './item';

export const ThemeItem = () => {
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();
  const modal = useModal();

  const onSelect = React.useCallback(
    (option: OptionType) => {
      setSelectedTheme(option.value as ColorSchemeType);
      modal.dismiss();
    },
    [setSelectedTheme, modal]
  );

  const themes = React.useMemo(
    () => [
      { 
        label: translate('settings.theme.dark'), 
        value: 'dark',
        icon: Moon
      },
      { 
        label: translate('settings.theme.light'), 
        value: 'light',
        icon: Sun
      },
      { 
        label: translate('settings.theme.system'), 
        value: 'system',
        icon: System
      },
    ],
    []
  );

  const theme = React.useMemo(
    () => themes.find((t) => t.value === selectedTheme),
    [selectedTheme, themes]
  );

  return (
    <>
      <Item
        text="settings.theme.title"
        value={theme?.label}
        onPress={modal.present}
      />
      <Options
        ref={modal.ref}
        options={themes}
        onSelect={onSelect}
        value={theme?.value}
      />
    </>
  );
};
