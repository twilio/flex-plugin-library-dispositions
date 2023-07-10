import * as Flex from '@twilio/flex-ui';

import { getDispositionsForQueue, isNotesEnabled, isRequireDispositionEnabledForQueue } from '../../utils/config';
import { AppState } from '../states';
import { reduxNamespace } from '../states';
import { DispositionsState } from '../states';
import { DispositionsNotification } from '../notifications/DispositionNotification';
import TaskRouterService from '../../service/TaskRouterService';
import { ErrorManager, FlexPluginErrorType } from '../../utils/ErrorManager';
import Analytics, { Event } from '../../utils/Analytics';

const handleAbort = (flex: typeof Flex, abortFunction: any) => {
  flex.Notifications.showNotification(DispositionsNotification.DispositionRequired);

  flex.Actions.invokeAction('SetComponentState', {
    name: 'AgentTaskCanvasTabs',
    state: { selectedTabName: 'disposition' },
  });

  abortFunction();
};

export function setDispositionBeforeCompleteTask(flex: typeof Flex, manager: Flex.Manager) {
  try {
    flex.Actions.addListener('beforeCompleteTask', async (payload, abortFunction) => {
      if (!payload.task?.taskSid) {
        return;
      }

      const numDispositions = getDispositionsForQueue(payload.task?.queueSid ?? '').length;

      // If notes disabled, and no dispositions are configured, return.
      if (numDispositions < 1 && !isNotesEnabled()) {
        return;
      }

      // First, check if a disposition and/or notes are set.
      const { tasks } = (manager.store.getState() as AppState)[reduxNamespace] as DispositionsState;

      if (!tasks || !tasks[payload.task.taskSid]) {
        if (isRequireDispositionEnabledForQueue(payload.task.queueSid) && numDispositions > 0) {
          handleAbort(flex, abortFunction);
        }
        return;
      }

      const taskDisposition = tasks[payload.task.taskSid];
      let newConvAttributes = {};

      if (
        isRequireDispositionEnabledForQueue(payload.task.queueSid) &&
        !taskDisposition.disposition &&
        numDispositions > 0
      ) {
        handleAbort(flex, abortFunction);
        return;
      }

      if (!taskDisposition.disposition && (!isNotesEnabled() || !taskDisposition.notes)) {
        // Nothing for us to do, and it's okay!
        return;
      }

      if (taskDisposition.disposition) {
        newConvAttributes = {
          ...newConvAttributes,
          outcome: taskDisposition.disposition,
        };
      }

      if (isNotesEnabled() && taskDisposition.notes) {
        newConvAttributes = {
          ...newConvAttributes,
          content: taskDisposition.notes,
        };
      }
      if (taskDisposition.disposition || taskDisposition.notes) {
        Analytics.track(Event.DISPOSITION_SELECTED, {
          taskSid: payload.task.taskSid,
        });
      }
      try {
        await TaskRouterService.updateTaskAttributes(payload.task.taskSid, {
          conversations: newConvAttributes,
        });
      } catch (error) {
        console.log(`Failed to set disposition attributes for ${payload.task.taskSid} to ${newConvAttributes}`, error);
      }
    });
  } catch (e) {
    throw ErrorManager.createAndProcessError("Could not add 'beforeCompleteTask' listener", {
      type: FlexPluginErrorType.action,
      description: e instanceof Error ? `${e.message}` : "Could not add 'beforeCompleteTask' listener",
      context: 'Plugin.Action.beforeCompleteTask',
      wrappedError: e,
    });
  }
}
