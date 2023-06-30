import { merge } from 'lodash';
import { TaskHelper } from '@twilio/flex-ui';

import ApiService from './ApiService';
import { EncodedParams } from '../types/Params';
import { ErrorManager, FlexPluginErrorType } from '../utils/ErrorManager';

interface UpdateTaskAttributesResponse {
  success: boolean;
}


class TaskRouterService extends ApiService {
  private instanceSid = this.manager.serviceConfiguration.flex_service_instance_sid;

  private STORAGE_KEY = `pending_task_updates_${this.instanceSid}`;

  addToLocalStorage(taskSid: string, attributesUpdate: object): void {
    const storageValue = localStorage.getItem(this.STORAGE_KEY);
    let storageObject = {} as { [taskSid: string]: any };

    if (storageValue) {
      storageObject = JSON.parse(storageValue);
    }

    if (!storageObject[taskSid]) {
      storageObject[taskSid] = {};
    }

    storageObject[taskSid] = merge({}, storageObject[taskSid], attributesUpdate);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageObject));
  }

  fetchFromLocalStorage(taskSid: string): any {
    const storageValue = localStorage.getItem(this.STORAGE_KEY);
    let storageObject = {} as { [taskSid: string]: any };

    if (storageValue) {
      storageObject = JSON.parse(storageValue);
    }

    if (!storageObject[taskSid]) {
      storageObject[taskSid] = {};
    }

    return storageObject[taskSid];
  }

  removeFromLocalStorage(taskSid: string): void {
    const storageValue = localStorage.getItem(this.STORAGE_KEY);
    let storageObject = {} as { [taskSid: string]: any };
    let changed = false;

    if (storageValue) {
      storageObject = JSON.parse(storageValue);
    }

    if (storageObject[taskSid]) {
      delete storageObject[taskSid];
      changed = true;
    }

    // Janitor - clean up any tasks that we don't have
    for (const [key] of Object.entries(storageObject)) {
      if (!TaskHelper.getTaskByTaskSid(key)) {
        delete storageObject[key];
        changed = true;
      }
    }

    if (changed) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageObject));
    }
  }

  updateTaskAttributes = async (
    taskSid: string,
    attributesUpdate: object,
    deferUpdates: boolean = false,
  ): Promise<boolean> => {
    if (deferUpdates) {
      // Defer update; merge new attrs into local storage
      this.addToLocalStorage(taskSid, attributesUpdate);
      return true;
    }

    // Fetch attrs from local storage and merge into the provided attrs
    const mergedAttributesUpdate = merge({}, this.fetchFromLocalStorage(taskSid), attributesUpdate);
    if (Object.keys(mergedAttributesUpdate).length < 1) {
      // No attributes provided to update
      return true;
    }

    return new Promise((resolve,reject) =>{
      const encodedParams: EncodedParams = {
        Token: encodeURIComponent(this.manager.user.token),
        taskSid: encodeURIComponent(taskSid),
        attributesUpdate: encodeURIComponent(JSON.stringify(mergedAttributesUpdate)),
      };
  
      this.fetchJsonWithReject<UpdateTaskAttributesResponse>(
        `https://${this.serverlessDomain}/disposition/update-task-attributes`,
        {
          method: 'post',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      ).then((response: UpdateTaskAttributesResponse) => {
        if (response.success) {
          // we've pushed updates; remove pending attributes
          this.removeFromLocalStorage(taskSid);
        }
        resolve(response.success);
      })
      .catch((e)=>{
        console.error(`Could not update task attributes for the task ${taskSid}`, e);
        ErrorManager.createAndProcessError(
          `Could not update task attributes for the task ${taskSid}\r\n`,
          {
            type: FlexPluginErrorType.serverless,
            description:
              e instanceof Error
                ? `${e.message}`
                : `Could not update task attributes for the task ${taskSid}\r\n`,
            context: 'Plugin.TaskRouterService',
            wrappedError: e,
          },
        );
        reject(e);
      });
    })
  }
}

export default new TaskRouterService();
