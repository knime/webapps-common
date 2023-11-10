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
 *   Jul 10, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.handler;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;

/**
 *
 * The fields specified in this class have to reference other settings of the current node settings. To reference a
 * setting, use the same name and the same type (for nested settings all names along the way have to match) as the field
 * that is to be referenced. If there is a field which is not unique with respect to its field name and type, use the
 * {@link DeclaringDefaultNodeSettings} annotation to further specify the specific node settings class of the field. *
 * <p>
 * Example:
 *
 * <pre>
 *            class OtherSettings {
 *                  // referencing "MyNodeModelSettings#m_foo".
 *                  &#64;DeclaringDefaultNodeSettings(MyNodeModelSettings.class)
 *                  String m_bar;
 *            }
 *
 *            class MyActionHandler implements DialogDataServiceHandler<String, OtherSettings>
 *
 *            class MyNodeViewSettings extends DefaultNodeSettings {
 *
 *                &#64;ButtonWidget(actionHandler = MyActionHandler)
 *                String m_foo;
 *
 *                String m_bar;
 *
 *            }
 *
 *            class MyNodeModelSettings extends DefaultNodeSettings {
 *                String m_bar;
 *            }
 *
 * </pre>
 *
 * For simple scenarios where there is only one {@link DefaultNodeSettings} class used and a setting should depend on
 * all other settings, the {@link DefaultNodeSettings} class itself can be directly used as the generic class.
 *
 * @param <S> the settings, the handler is depending on.
 *
 * @author Paul Bärnreuther
 *
 */
public interface DependencyHandler<S> {

    @SuppressWarnings({"unchecked", "javadoc"})
    default S castToDependencies(final Object settings) {
        return (S)settings;
    }

}
