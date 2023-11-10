/*
 * ------------------------------------------------------------------------
 *
 *  Copyright by KNIME AG, Zurich, Switzerland
 *  Website: http://www.knime.com; Email: contact@knime.com
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License, Version 3, as
 *  published by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful, but
 *  WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, see <http://www.gnu.org/licenses>.
 *
 *  Additional permission under GNU GPL version 3 section 7:
 *
 *  KNIME interoperates with ECLIPSE solely via ECLIPSE's plug-in APIs.
 *  Hence, KNIME and ECLIPSE are both independent programs and are not
 *  derived from each other. Should, however, the interpretation of the
 *  GNU GPL Version 3 ("License") under any applicable laws result in
 *  KNIME and ECLIPSE being a combined program, KNIME AG herewith grants
 *  you the additional permission to use and propagate KNIME together with
 *  ECLIPSE with only the license terms in place for ECLIPSE applying to
 *  ECLIPSE and the GNU GPL Version 3 applying for KNIME, provided the
 *  license terms of ECLIPSE themselves allow for the respective use and
 *  propagation of ECLIPSE together with KNIME.
 *
 *  Additional permission relating to nodes for KNIME that extend the Node
 *  Extension (and in particular that are based on subclasses of NodeModel,
 *  NodeDialog, and NodeView) and that only interoperate with KNIME through
 *  standard APIs ("Nodes"):
 *  Nodes are deemed to be separate and independent programs and to not be
 *  covered works.  Notwithstanding anything to the contrary in the
 *  License, the License does not apply to Nodes, you are not required to
 *  license Nodes under the License, and you are granted a license to
 *  prepare and propagate Nodes, in each case even if such Nodes are
 *  propagated with or for interoperation with KNIME.  The owner of a Node
 *  may freely choose the license terms applicable to such Node, including
 *  when such Node is propagated with or for interoperation with KNIME.
 * ---------------------------------------------------------------------
 *
 * History
 *   May 2, 2023 (Paul Bärnreuther): created
 */

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
