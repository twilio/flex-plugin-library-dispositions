## Details
#### How it works
Plugin is ready to use once it is installed and disposition codes are defined in flex config (see Installation steps below) and the browser window is refreshed.
- This feature adds a disposition tab to TaskCanvasTabs.
- Agents will be able to select a predefined disposition code before completing a task.
- Selection of disposition codes at the time of completing a task can be configured to be optional or required.
- A free-form notes field can also be enabled for recording notes when completing the task.
- If no dispositions are configured and notes are not enabled, the dispositions tab will not be added.
#### Installation
- After installing the plugin, the settings for this plugin are to be set in flex config. Refer [Flex Configuration REST API](https://www.twilio.com/docs/flex/developer/config/flex-configuration-rest-api) docs. 
- Sample payload for setting disposition codes in flex config:
```json
{
    "account_sid": "ACXXXXXXXXXXXXXXXXX",
    "ui_attributes": {
        "custom_data":{
            "features":{
                "dispositions": {
                    "enable_notes": true,
                    "require_disposition": true,
                    "global_dispositions": ['Disposition 1','Disposition 2','Disposition 3'],
                    "per_queue": {
                        "QSXXXXXXXXXXXXXX": {
                            "require_disposition": true,
                            "dispositions": ['Disposition 4','Disposition 5','Disposition 6']
                        }
                    }
                }
            }
        }
    }
}
```
- Configuration properties:
	- `enable_notes`  - set this to true to enable a free-form notes field in addition to disposition selection
	- `require_disposition`  - set this to true to require the agent to select a disposition in order to complete the task
	- `global_dispositions`  - provide a string array of dispositions to list for tasks from any queue
	- `per_queue`  - allows you to set different configurations for tasks from the provided queue SID(s)
	- `require_disposition`  - require the agent to select a disposition to complete tasks from this queue SID
	- `dispositions`  - dispositions that are only listed for tasks from this queue SID
- **Note** If both global and per-queue dispositions are configured, the agent will see a combined list. If present, the per-queue `require_disposition` setting will override the higher-level `require_dispositions` setting.
