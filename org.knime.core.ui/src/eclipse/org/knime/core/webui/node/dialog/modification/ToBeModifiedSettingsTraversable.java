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
 *   May 29, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.modification;

import java.util.Optional;

import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.webui.node.dialog.VariableSettingsRO;
import org.knime.core.webui.node.dialog.modification.traversal.NodeSettingsROTraversable;
import org.knime.core.webui.node.dialog.modification.traversal.NodeSettingsTraversable;
import org.knime.core.webui.node.dialog.modification.traversal.TreeTraversalUtil.Traversable;
import org.knime.core.webui.node.dialog.modification.traversal.VariableSettingsTraversable;

/**
 * A field-wise tree-structure on {@link ToBeModifiedSettings}, i.e. the canonical structure that can be constructed on
 * a record when all of its fields have a tree structure.
 *
 * @author Paul Bärnreuther
 */
final class ToBeModifiedSettingsTraversable implements Traversable<ToBeModifiedSettings> {

    private org.knime.core.webui.node.dialog.modification.traversal.TreeTraversalUtil.Traversable<Optional<NodeSettings>> m_provisionalSettingsTree;

    private Traversable<Optional<NodeSettingsRO>> m_previousSettingsTree;

    private Traversable<Optional<VariableSettingsRO>> m_appliedVariableSettingsTree;

    ToBeModifiedSettingsTraversable(final ToBeModifiedSettings toBeModifiedSettings) {
        this(new NodeSettingsTraversable(toBeModifiedSettings.provisionalSettings().orElse(null)),
            new NodeSettingsROTraversable(toBeModifiedSettings.previousSettings().orElse(null)),
            new VariableSettingsTraversable(toBeModifiedSettings.appliedVariableSettings().orElse(null)));
    }

    private ToBeModifiedSettingsTraversable(final Traversable<Optional<NodeSettings>> appliedSettingsTree,
        final Traversable<Optional<NodeSettingsRO>> previousSettingsTree,
        final Traversable<Optional<VariableSettingsRO>> appliedVariablesSettingsTree) {
        m_provisionalSettingsTree = appliedSettingsTree;
        m_previousSettingsTree = previousSettingsTree;
        m_appliedVariableSettingsTree = appliedVariablesSettingsTree;
    }

    @Override
    public ToBeModifiedSettings get() {
        return new ToBeModifiedSettings(m_provisionalSettingsTree.get(), m_previousSettingsTree.get(),
            m_appliedVariableSettingsTree.get());
    }

    @Override
    public Traversable<ToBeModifiedSettings> getChild(final String key) {
        return new ToBeModifiedSettingsTraversable(m_provisionalSettingsTree.getChild(key),
            m_previousSettingsTree.getChild(key), m_appliedVariableSettingsTree.getChild(key));
    }

}