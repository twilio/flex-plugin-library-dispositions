// Export the template names as an enum for better maintainability when accessing them elsewhere
import * as Flex from '@twilio/flex-ui';

export enum StringTemplates {
  DispositionRequired = 'PSDispositionRequired',
  DispositionTab = 'PSDispositionTab',
  SelectDispositionTitle = 'PSSelectDispositionTitle',
  SelectDispositionHelpText = 'PSSelectDispositionHelpText',
  NotesTitle = 'PSNotesTitle',
  NotesCharactersRemaining = 'PSNotesCharactersRemaining',
}

const customStrings = {
  [StringTemplates.DispositionRequired]: 'A disposition is required before you may complete this task.',
  [StringTemplates.DispositionTab]: 'Disposition',
  [StringTemplates.SelectDispositionTitle]: 'Select a disposition',
  [StringTemplates.SelectDispositionHelpText]: 'The selected disposition will be saved when you complete this task.',
  [StringTemplates.NotesTitle]: 'Notes',
  [StringTemplates.NotesCharactersRemaining]: '{{characters}} characters remaining',
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.strings = {
    ...manager.strings,
    ...customStrings,
  } as any;
};
