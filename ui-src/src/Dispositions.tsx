import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import CustomizePasteElements from './utils/PasteThemeProvider';
import { setDispositionBeforeCompleteTask } from './flex-hooks/actions/CompleteTask';
import { addDispositionTab } from './flex-hooks/components/TaskCanvasTabs';
import Dispositions from './flex-hooks/notifications/DispositionNotification';
import AddReducers from '../src/flex-hooks/redux';
import DispositionString from './flex-hooks/strings/Disposition';
const PLUGIN_NAME = 'Disposition';

export default class Disposition extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    const initializers = [
      AddReducers,
      setDispositionBeforeCompleteTask,
      addDispositionTab,
      Dispositions,
      DispositionString,
      CustomizePasteElements,
    ];

    initializers.forEach((initializer) => initializer(flex, manager));
  }
}
