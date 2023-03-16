# Node Dialog

The dialog of a node is an UI extension responsible for loading and saving settings. It translates between different states of the lifecycle of settings.

1. **Loading**: NodeSettings[RO](## "Read Object") &rarr; [NodeSettings](## "Java object")
2. **Sending to the frontend**: NodeSettings &rarr; Text
3. **Applying data from the frontend**: Text &rarr; NodeSettings
4. **Saving data**: NodeSettings &rarr; NodeSettings[WO](## "Write Object")

Hereby the NodeSettings are composed of the Model- and View-Settings of the node.

## Persistence

By which rules the NodeSettings should be loaded and saved is specified by certain persistors associated to them. 

See [here](./persistence/Readme.md).

## Default Implementation: JsonForms

This implementation utilizes [JsonForms](https://jsonforms.io/) as text medium for the communication with the frontend. 
The text representation of the settings is a JSON with three parts:

* The **Data** holding the state of the NodeSettings
* A **Schema** specifying the data.
* A **UISchema** specifying the UI of the dialog.

### Data

Fields of the provided view (resp. model) settings of the node are translated to entries in a `view` (resp. `model`) property of the JSON.
The following fields are ignored

* Private fields without a getter method
* Fields annotated with `@JsonIgnore`
* Fields whose getters are annotated with `@JsonIgnore`
* Fields with `null` value

All other fields are translated automatically into a json structure. 
During this translation, the following is applied:

*  `m_`-prefixes are removed.
*  Enums and BigDecimals are serialized as their string value.

Hereby nested fields are translated to a nested JSON structure.

### Schema

The JSON forms schema defines the type, structure, title, description and validity of the data.

While type and structure are recognized automatically, additional information can be controlled by using a [`@Schema`](./impl/Schema.java) annotation on any field translated to [JSON Forms data](### Data).

### UISchema
<!-- TODO: Adjust this documentation with UIEXT-554 -->
The UISchema is currently not generated automatically by this part of the framework and has to be provided as a file on the disc.