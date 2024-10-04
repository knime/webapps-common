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
 *   Oct 4, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.configmapping.ConfigPath;
import org.knime.core.webui.node.dialog.configmapping.ConfigsDeprecation;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.ConfigKeyUtil;
import org.knime.core.webui.node.dialog.defaultdialog.tree.ArrayParentNode;
import org.knime.core.webui.node.dialog.defaultdialog.tree.LeafNode;
import org.knime.core.webui.node.dialog.defaultdialog.tree.Tree;
import org.knime.core.webui.node.dialog.defaultdialog.tree.TreeNode;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

final class PersistUtil {

    private PersistUtil() {
        // Utility
    }

    static void addPersist(final ObjectNode uiSchema, final Map<SettingsType, Tree<PersistableSettings>> persistTrees) {
        final var persist = uiSchema.putObject("persist");
        persistTrees.entrySet()
            .forEach(entry -> addPersist(persist.putObject(entry.getKey().getConfigKey()), entry.getValue()));
    }

    static void addPersist(final ObjectNode objectNode, final Tree<PersistableSettings> persistTree) {
        objectNode.put("type", "object");
        addConfigKeys(objectNode, persistTree);
        final var properties = objectNode.putObject("properties");
        persistTree.getChildrenByName().entrySet().forEach(entry -> {
            final var childObjectNode = properties.putObject(entry.getKey());
            final var childTreeNode = entry.getValue();
            if (childTreeNode instanceof Tree<PersistableSettings> t) {
                addPersist(childObjectNode, t);
            }
            if (childTreeNode instanceof ArrayParentNode<PersistableSettings> apn) {
                addPersist(childObjectNode, apn);
            }
            if (childTreeNode instanceof LeafNode<PersistableSettings> l) {
                addPersist(childObjectNode, l);
            }
        });
    }

    private static void addPersist(final ObjectNode childObjectNode, final LeafNode<PersistableSettings> leafNode) {
        childObjectNode.put("type", "not an object, not an array");
        addConfigKeys(childObjectNode, leafNode);
    }

    private static void addPersist(final ObjectNode childObjectNode,
        final ArrayParentNode<PersistableSettings> arrayParentNode) {
        childObjectNode.put("type", "array");
        addConfigKeys(childObjectNode, arrayParentNode);
        final var items = childObjectNode.putObject("items");
        addPersist(items, arrayParentNode.getElementTree());
    }

    // Mostly copied from JsonFormsSchemaUtil

    /** Add a "configKeys" array to the field if a custom persistor is used */
    private static void addConfigKeys(final ObjectNode node, final TreeNode<PersistableSettings> field) {
        var configKeys = ConfigKeyUtil.getConfigKeysUsedByPersistNode(field);
        if (configKeys.length > 0) {
            var configKeysNode = node.putArray("configKeys");
            Arrays.stream(configKeys).forEach(configKeysNode::add);
        }
        var subConfigKeys = ConfigKeyUtil.getSubConfigKeysUsedByField(field);
        if (subConfigKeys != null) {
            var subConfigKeysNode = node.putArray("subConfigKeys");
            for (var subConfigKey : subConfigKeys) {
                var subConfigKeyNode = subConfigKeysNode.addArray();
                Arrays.stream(subConfigKey).forEach(subConfigKeyNode::add);
            }
        }
        var deprecatedConfigsArray = ConfigKeyUtil.getDeprecatedConfigsUsedByField(field);
        if (deprecatedConfigsArray.length > 0) {
            final var deprecatedConfigsNode = node.putArray("deprecatedConfigKeys");
            Arrays.stream(deprecatedConfigsArray)
                .forEach(deprecatedConfigs -> putDeprecatedConfig(deprecatedConfigsNode, deprecatedConfigs));
        }
    }

    private static void putDeprecatedConfig(final ArrayNode deprecatedConfigsNode,
        final ConfigsDeprecation configsDeprecation) {
        final var nextDeprecatedConfigs = deprecatedConfigsNode.addObject();
        add2DStingArray(nextDeprecatedConfigs, "new",
            configsDeprecation.getNewConfigPaths().stream().map(ConfigPath::path).toList());
        add2DStingArray(nextDeprecatedConfigs, "deprecated",
            configsDeprecation.getDeprecatedConfigPaths().stream().map(ConfigPath::path).toList());
    }

    private static void add2DStingArray(final ObjectNode node, final String key,
        final List<List<String>> twoDimensionalArray) {
        final var parentArrayNode = node.putArray(key);
        twoDimensionalArray.forEach(oneDimensionalArray -> {
            final var childArray = parentArrayNode.addArray();
            oneDimensionalArray.forEach(childArray::add);
        });
    }

}
