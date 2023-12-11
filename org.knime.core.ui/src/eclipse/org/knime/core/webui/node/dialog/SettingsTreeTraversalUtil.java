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
 *   Dec 12, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.config.base.AbstractConfigEntry;
import org.knime.core.webui.node.dialog.internal.VariableSettings;

/**
 *
 * @author Paul Bärnreuther
 */
class SettingsTreeTraversalUtil {

    /**
     * Traverses the variable-settings-tree (i.e. whether a setting is controlled by a variable or exposed as a
     * variable) and a settings tree at the same time and evaluates the 'stopCriterion' at every leaf.
     *
     * @return 'true' if the stop criterion has been evaluated to 'true' during the traversal
     */
    static boolean traverseSettingsTrees(final VariableSettingsTree tree, final StopCriterion stopCriterion) {
        for (var node : tree.getNodes()) {
            final var nestedTree = node.getNestedTree();
            if (nestedTree.isPresent()) {
                if (traverseSettingsTrees(nestedTree.get(), stopCriterion)) {
                    return true;
                }
            } else if (stopCriterion.stop(node)) {
                return true;
            }
        }
        return false;
    }

    interface StopCriterion {
        boolean stop(VariableSettingsTreeNode leaf);
    }

    /**
     * settings and previousSettings are guaranteed to be non-null, while variables and previousVariables can be null
     */
    static record VariableSettingsTree(NodeSettingsRO variables, NodeSettingsRO settings,
        NodeSettingsRO previousSettings, NodeSettingsRO previousVariables) {

        /**
         * @param applyDataSettings
         */
        public VariableSettingsTree(final ApplyDataSettings applyDataSettings) {
            this(applyDataSettings.getVariables().orElse(null), applyDataSettings.getSettings(),
                applyDataSettings.getPreviousSettings(), applyDataSettings.getPreviousVariables().orElse(null));
        }

        /**
         * runtime is quadratic in number of settings, since the getSettingsChildByKey has linear runtime
         */
        Collection<VariableSettingsTreeNode> getNodes() {
            if (variables() == null) {
                return Collections.emptyList();
            }
            return variables().keySet().stream().map(this::getSubTree).flatMap(Optional::stream).toList();
        }

        private Optional<VariableSettingsTreeNode> getSubTree(final String key) {
            var variable = getSettingsChildByKey(variables(), key);
            if (!(variable instanceof NodeSettingsRO)) {
                return Optional.empty(); // unexpected (yet not unrecoverable) state: variable should have children
            }
            var setting = getSettingsChildByKey(settings(), key);
            if (setting == null) {
                return Optional.empty(); // unexpected (yet not unrecoverable) state: setting should be present
            }
            var previousSetting = getSettingsChildByKey(previousSettings(), key);
            if (previousSetting == null) {
                return Optional.empty(); // unexpected (yet not unrecoverable) state: setting should be present
            }

            var previousVariable = previousVariables() == null ? null : getSettingsChildByKey(previousVariables(), key);

            final var subTree = new VariableSettingsTreeNode((NodeSettingsRO)variable, setting, previousSetting,
                (NodeSettingsRO)previousVariable);
            return Optional.of(subTree);
        }

        /**
         * Helper method to get a child of arbitrary type by its key / name
         */
        private static AbstractConfigEntry getSettingsChildByKey(final NodeSettingsRO settings, final String key) {
            for (var i = 0; i < settings.getChildCount(); i++) {
                var treeNode = settings.getChildAt(i);
                if (!(treeNode instanceof AbstractConfigEntry)) {
                    continue; // unexpected (yet not unrecoverable) state: setting should be of type AbstractConfigEntry
                }
                var ace = (AbstractConfigEntry)treeNode;
                if (ace.getKey().equals(key)) {
                    return ace;
                }
            }
            return null;
        }

    }

    static record VariableSettingsTreeNode(NodeSettingsRO variables, AbstractConfigEntry settings,
        AbstractConfigEntry previousSettings, NodeSettingsRO previousVariables) {

        Optional<VariableSettingsTree> getNestedTree() {
            if (!isLeafVariableNodeSettings(variables) && settings instanceof NodeSettingsRO
                && previousSettings instanceof NodeSettingsRO) {
                return Optional.of(new VariableSettingsTree(variables, (NodeSettingsRO)settings,
                    (NodeSettingsRO)previousSettings, previousVariables));
            }
            return Optional.empty();
        }

        private static boolean isLeafVariableNodeSettings(final NodeSettingsRO variable) {
            return variable.containsKey(VariableSettings.USED_VARIABLE_CFG_KEY)
                || variable.containsKey(VariableSettings.EXPOSED_VARIABLE_CFG_KEY);
        }
    }
}
