/**
 * The dialog of a node is an UI extension that allows a user to change node settings. It translates between different
 * states of the lifecycle of settings.
 * <ol type = "1">
 * <li><b>Loading</b>: {@link NodeSettingsRO} &rarr; Node settings</li>
 * <li><b>Sending to the frontend</b>: Node settings &rarr; Text</li>
 * <li><b>Applying data from the frontend</b>: Text &rarr; Node settings</li>
 * <li><b>Saving data</b>: Node settings &rarr; {@link NodeSettingsRO}</li>
 * </ul>
 * Hereby the Node settings are combined of classes for Model- and View-Settings of the node.
 *
 * <h2>Persistence</h2>
 *
 * <p>
 * By which rules the NodeSettings should be loaded and saved is specified by certain persistors associated to them (see
 * {@link org.knime.core.webui.node.dialog.defaultdialog.persistence})
 * </p>
 *
 * <h2>Default Implementation: JsonForms</h2>
 *
 * <p>
 * The default implementation of the above specifications is using <a href="https://jsonforms.io/">JsonForms</a> as text
 * medium (see {@link org.knime.core.webui.node.defaultdialog.jsonforms})
 * </p>
 *
 *
 * @see {@link {@link org.knime.core.webui.node.defaultdialog Default implementation}
 */
package org.knime.core.webui.node.dialog;
