import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Actions, ITask, Manager, Template, templates, withTaskContext } from '@twilio/flex-ui';
import { Radio, RadioGroup } from '@twilio-paste/core/radio-group';
import { Stack } from '@twilio-paste/core/stack';
import { TextArea } from '@twilio-paste/core/textarea';
import { Label } from '@twilio-paste/core/label';
import { HelpText } from '@twilio-paste/core/help-text';
import { Box } from '@twilio-paste/core/box';
import { debounce } from 'lodash';

import { getDispositionsForQueue, isNotesEnabled, isRequireDispositionEnabledForQueue } from '../utils/config';
import { AppState } from '../flex-hooks/states';
import { reduxNamespace } from '../flex-hooks/states';
import { updateDisposition, DispositionsState } from '../flex-hooks/states';
import { StringTemplates } from '../flex-hooks/strings/Disposition';

export interface OwnProps {
  task?: ITask;
}

const DispositionTab = ({task}: OwnProps) => {
  const NOTES_MAX_LENGTH = 100;
  const taskSid = task && task?.taskSid || '';
  const [notes, setNotes] = useState('');

  const dispatch = useDispatch();
  const { tasks } = useSelector((state: AppState) => state[reduxNamespace] as DispositionsState);
  const dispositionForTask = tasks && tasks[taskSid] ? tasks[taskSid].disposition : '';
  const notesForTask = tasks && tasks[taskSid] ? tasks[taskSid].notes : '';
  const strings = Manager.getInstance().strings as any;

  useEffect(()=>{
    setNotes(notesForTask)
  },[task?.taskSid])

  const updateStore = (value="") => {
    if (!task) return;

    let payload = {
      taskSid: task.taskSid,
      disposition: '',
      notes: '',
    };

    if (tasks && tasks[task.taskSid]) {
      payload = {
        ...payload,
        ...tasks[task.taskSid],
      };
    }

    if (value) {
      payload.disposition = value;
    }

    if (isNotesEnabled() && notes) {
      payload.notes = notes;
    }
    dispatch(updateDisposition(payload));
  };

  const updateStoreDebounced = debounce(updateStore, 250, { maxWait: 1000 });

  useEffect(() => {
    if (tasks && task && tasks[task.taskSid]) {
      if (isNotesEnabled() && tasks[task.taskSid].notes) {
        setNotes(tasks[task.taskSid].notes);
      }
    }
  }, []);

  useEffect(() => {
    if (!isNotesEnabled()) return;
    updateStoreDebounced();
  }, [notes]);

  useEffect(() => {
    // Pop the disposition tab when the task enters wrapping status.
    // We do this here because WrapupTask does not handle a customer-ended task,
    // and doing this in the taskWrapup event seems to not work.
    if (task?.status === 'wrapping') {
      Actions.invokeAction('SetComponentState', {
        name: 'AgentTaskCanvasTabs',
        state: { selectedTabName: 'disposition' },
      });
    }
  }, [task?.status]);

  return (
    <Box padding="space80">
      <Stack orientation="vertical" spacing="space80">
        {getDispositionsForQueue(task?.queueSid ?? '').length > 0 && (
          <RadioGroup
            name={`${task?.sid}-disposition`}
            value={dispositionForTask}
            legend={strings[StringTemplates.SelectDispositionTitle]}
            helpText={strings[StringTemplates.SelectDispositionHelpText]}
            onChange={(value) => updateStore(value)}
            required={isRequireDispositionEnabledForQueue(task?.queueSid ?? '')}
          >
            {getDispositionsForQueue(task?.queueSid ?? '').map((disp,i) => (
              <Radio
                id={`${task?.sid}-disposition-${disp}${i}`}
                value={disp}
                name={`${task?.sid}-disposition`}
                key={`${task?.sid}-disposition-${disp}${i}`}
              >
                {disp}
              </Radio>
            ))}
          </RadioGroup>
        )}
        {isNotesEnabled() && (
          <>
            <Label htmlFor="notes">{strings[StringTemplates.NotesTitle]}</Label>
            <TextArea
              onChange={(e) => setNotes(e.target.value)}
              aria-describedby="notes_help_text"
              id={`${task?.sid}-notes`}
              name={`${task?.sid}-notes`}
              value={notes}
              maxLength={NOTES_MAX_LENGTH}
            />
            <HelpText id="notes_help_text">
              <Template
                source={templates[StringTemplates.NotesCharactersRemaining]}
                characters={NOTES_MAX_LENGTH - notes.length}
              />
            </HelpText>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default withTaskContext(DispositionTab);
