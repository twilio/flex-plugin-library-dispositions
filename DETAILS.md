## Details

### Prerequisites

Within your ui_attributes file, there are several settings for the dispositions plugin that can be set:

``` enable_notes ``` - set this to true to enable a free-form notes field in addition to disposition\
``` require_disposition ``` - set this to true to require the agent to select a disposition in order to complete the task\
``` global_dispositions ``` - provide a string array of dispositions to list for tasks from any queue\
``` per_queue ``` - allows you to set different configurations for tasks from the provided queue SID(s)\
        ``` require_disposition ``` - require the agent to select a disposition to complete tasks from this queue SID\
        ``` dispositions ``` - dispositions that are only listed for tasks from this queue SID

***Note*** If both global and per-queue dispositions are configured, the agent will be see a combined list. If present, the per-queue require_disposition setting will override the higher-level require_dispositions setting.

Once your updated flex-config is deployed, the plugin is ready to use.

### How it works
Plugin is ready to use once it is installed and the browser window is refreshed and flex-config is updated.
This plugin adds a disposition tab to ``` TaskCanvas ```. When the task enters the wrapping state, the disposition tab is automatically selected. The user's selected disposition and/or notes are stored in state. When the Complete Task button is pressed, the selected values are read from state and written to task attributes. The disposition is stored in the conversations.outcome attribute, and notes are stored in the conversations.content attribute.

If ``` require_disposition ``` is enabled, and there are dispositions configured, the agent will not be allowed to complete the task until one is selected.

If no dispositions are configured, and notes are not enabled, the dispositions tab will not be added.

### Installation
During installation, 1 field is required:

 1. *TaskRouter Workspace SID*: This is the SID of the "Flex Task Assignment" workspace that you see in [Twilio Console > TaskRouter > Workspaces](https://console.twilio.com/us1/develop/taskrouter/workspaces).Please refer screenshot below:
 ![Workspace Sid example](https://raw.githubusercontent.com/twilio/flex-plugin-library-chat-transfer/main/screenshots/workspace_sid_help.png)
