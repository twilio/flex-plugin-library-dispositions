## version 1.0.1

- Introduced the usage of flex-ui-telemetry package instead of individual classes.
- Introduced the usage of flex-plugins-library-utils package, which is a helper package with all the common twilio-functions readily used amongst the plugins.

## version 1.0.0

This plugin adds a disposition tab to TaskCanvas. When the task enters the wrapping state, the disposition tab is automatically selected. The user's selected disposition and/or notes are stored in state. When the Complete Task button is pressed, the selected values are read from state and written to task attributes. The disposition is stored in the conversations.outcome attribute, and notes are stored in the conversations.content attribute.