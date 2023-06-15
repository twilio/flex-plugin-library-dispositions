import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as Flex from '@twilio/flex-ui';
import { combineReducers, Action as ReduxAction } from 'redux';

export interface DispositionsState {
  tasks: { [sid: string]: DispositionsTaskState };
}

export interface DispositionsTaskState {
  disposition: string;
  notes: string;
}

export interface DispositionsTaskUpdate extends DispositionsTaskState {
  taskSid: string;
}

const initialState = {
  tasks: {},
} as DispositionsState;

const dispositionsSlice = createSlice({
  name: 'dispositions',
  initialState,
  reducers: {
    updateDisposition(state, action: PayloadAction<DispositionsTaskUpdate>) {
      state.tasks = {
        ...state.tasks,
        [action.payload.taskSid]: {
          disposition: action.payload.disposition,
          notes: action.payload.notes,
        },
      };
    },
  },
});
 
export const reduxNamespace = 'dispositions';

export interface AppState {
  flex: Flex.AppState;
  [reduxNamespace]: any;
}

export const { updateDisposition } = dispositionsSlice.actions;
export default dispositionsSlice.reducer;
