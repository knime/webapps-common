/**
 * This package offers a default implementation of a Node Dialog as described in
 * {@link org.knime.core.webui.node.dialog}. It utilizes <a href="https://jsonforms.io/">JsonForms</a> to represent the
 * dialog and its components. The text representation of the settings is a JSON with three parts:
 * <ul>
 * <li><b>Data</b> holding the state of the NodeSettings.</li>
 * <li>A <b>Schema</b> specifying the data.</li>
 * <li>A <b>UISchema</b> specifying the UI.</li>
 * </ul>
 *
 * @see org.knime.core.webui.node.dialog.impl.JsonFormsSettingsImpl
 */
package org.knime.core.webui.node.dialog.impl;
