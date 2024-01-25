import * as Flex from '@twilio/flex-ui';
import DispositionsConfig from '../types/ServiceConfiguration';

type FlexUIAttributes = Flex.ServiceConfiguration['ui_attributes'];

interface UIAttributes extends FlexUIAttributes {
  custom_data: {
    features: any;
  };
}

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const {
  enable_notes = false,
  notes_max_length = 100,
  require_disposition = false,
  global_dispositions = [],
  per_queue = {},
} = (custom_data?.features?.dispositions as DispositionsConfig) || {};

export const isNotesEnabled = () => {
  return enable_notes;
};

export const getNotesMaxLengh = () => {
  return notes_max_length;
}

export const isRequireDispositionEnabledForQueue = (queueSid: string) => {
  let required = require_disposition;

  if (
    queueSid &&
    per_queue[queueSid] &&
    (per_queue[queueSid].require_disposition === true || per_queue[queueSid].require_disposition === false)
  ) {
    required = per_queue[queueSid].require_disposition;
  }

  return required;
};

export const getDispositionsForQueue = (queueSid: string): string[] => {
  let dispositions = [...global_dispositions];

  if (queueSid && per_queue[queueSid] && per_queue[queueSid].dispositions) {
    dispositions = [...dispositions, ...per_queue[queueSid].dispositions];
  }

  return dispositions;
};
