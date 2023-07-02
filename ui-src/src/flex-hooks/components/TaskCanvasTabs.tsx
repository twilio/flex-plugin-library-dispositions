import * as Flex from '@twilio/flex-ui';

import DispositionTab from '../../components/DispositionTab';
import { getDispositionsForQueue, isNotesEnabled } from '../../utils/config';

export function addDispositionTab(flex: typeof Flex, manager: Flex.Manager) {
  const strings = manager.strings;
  flex.TaskCanvasTabs.Content.add(
    <Flex.Tab key="disposition" uniqueName="disposition" label="Disposition">
      <DispositionTab key="disposition-tab-content" />
    </Flex.Tab>,
    {
      sortOrder: 1000,
      if: ({ task }) =>
        (getDispositionsForQueue(task?.queueSid ?? '').length > 0 || isNotesEnabled()) &&
        (Flex.TaskHelper.isTaskAccepted(task) || Flex.TaskHelper.isInWrapupMode(task)),
    },
  );
}
