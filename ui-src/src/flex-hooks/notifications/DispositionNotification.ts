import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings/Disposition';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum DispositionsNotification {
  DispositionRequired = 'PSDispositionRequired',
}

export default (flex:typeof Flex, manager: Flex.Manager) => {
  dispositionRequired(flex, manager);
}
// Return an array of Flex.Notification
function dispositionRequired (flex: typeof Flex, manager: Flex.Manager){
  flex.Notifications.registerNotification({
    id: DispositionsNotification.DispositionRequired,
    type: Flex.NotificationType.error,
    content: StringTemplates.DispositionRequired,
    timeout: 3500,
  });
}
