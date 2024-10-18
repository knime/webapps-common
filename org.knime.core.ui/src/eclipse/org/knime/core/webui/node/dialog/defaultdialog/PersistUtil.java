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
package org.knime.core.webui.node.dialog.defaultdialog;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.knime.core.node.defaultnodesettings.SettingsModel;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.configmapping.ConfigPath;
import org.knime.core.webui.node.dialog.configmapping.ConfigsDeprecation;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.ConfigKeyUtil;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.FieldNodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.persisttree.PersistTreeFactory;
import org.knime.core.webui.node.dialog.defaultdialog.tree.ArrayParentNode;
import org.knime.core.webui.node.dialog.defaultdialog.tree.LeafNode;
import org.knime.core.webui.node.dialog.defaultdialog.tree.Tree;
import org.knime.core.webui.node.dialog.defaultdialog.tree.TreeNode;
import org.knime.core.webui.node.dialog.defaultdialog.util.SettingsTypeMapUtil;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * For adding a representation of the settings persist structure to an ObjectNode
 *
 * @author Paul Bärnreuther
 */
public final class PersistUtil {

    private PersistUtil() {
        // Utility
    }

    /**
     * Adds the information necessary for the frontend to adapt flow variable handling to custom persisting given by
     * {@link Persist @Persist} annotations and deviations of the {@link PersistableSettings} structure from the
     * {@link WidgetGroup} structure.
     *
     * @param parentNode the parent object node to add to
     * @param persistTrees the persist trees to parse
     */
    static void addPersist(final ObjectNode parentNode,
        final Map<SettingsType, Tree<PersistableSettings>> persistTrees) {
        final var persist = parentNode.putObject("persist");
        final var properties = getObjectProperties(persist);
        persistTrees.entrySet()
            .forEach(entry -> addPersist(properties.putObject(entry.getKey().getConfigKey()), entry.getValue()));
    }

    /**
     * public and only used for tests
     *
     * @param parentNode
     * @param settings
     */
    public static void constructTreesAndAddPersist(final ObjectNode parentNode,
        final Map<SettingsType, DefaultNodeSettings> settings) {
        final var persistTreeFactory = new PersistTreeFactory();
        final var persistTrees =
            SettingsTypeMapUtil.map(settings, (type, s) -> persistTreeFactory.createTree(s.getClass(), type));
        addPersist(parentNode, persistTrees);
    }

    private static void addPersist(final ObjectNode objectNode, final Tree<PersistableSettings> persistTree) {
        if (!persistTree.isRoot()) {
            addConfigKeys(objectNode, persistTree);
        }
        final var properties = getObjectProperties(objectNode);
        persistTree.getChildrenByName().forEach((name, child) -> addPersist(properties, name, child));
    }

    private static void addPersist(final ObjectNode properties, final String name,
        final TreeNode<PersistableSettings> childTreeNode) {
        final var childObjectNode = properties.putObject(name);
        if (childTreeNode instanceof Tree<PersistableSettings> t) {
            addPersist(childObjectNode, t);
        }
        if (childTreeNode instanceof ArrayParentNode<PersistableSettings> apn) {
            addPersist(childObjectNode, apn);
        }
        if (childTreeNode instanceof LeafNode<PersistableSettings> l) {
            addPersist(childObjectNode, l);
        }
    }

    private static void addPersist(final ObjectNode objectNode, final LeafNode<PersistableSettings> leafNode) {
        addConfigKeys(objectNode, leafNode);
    }

    private static void addPersist(final ObjectNode objectNode,
        final ArrayParentNode<PersistableSettings> arrayParentNode) {
        objectNode.put("type", "array");
        addConfigKeys(objectNode, arrayParentNode);
        final var items = objectNode.putObject("items");
        addPersist(items, arrayParentNode.getElementTree());
    }

    private static ObjectNode getObjectProperties(final ObjectNode objectNode) {
        objectNode.put("type", "object");
        return objectNode.putObject("properties");
    }

    private static void addConfigKeys(final ObjectNode node, final TreeNode<PersistableSettings> field) {
        final var persistor = ConfigKeyUtil.extractFieldNodeSettingsPersistor(field);
        final var persist = field.getAnnotation(Persist.class);
        final var configRename = persist.map(Persist::configKey).filter(key -> !key.isEmpty());
        final var configPaths = persistor.map(FieldNodeSettingsPersistor::getConfigPaths);
        final boolean isHidden = persist.map(Persist::hidden).orElse(false);

        if (configPaths.isPresent()) {
            final var filteredValidatedConfigPaths = Arrays.stream(configPaths.get()).map(
                path -> Arrays.stream(path).filter(PersistUtil::isNonInternal).map(PersistUtil::validateKey).toList())
                .filter(path -> !path.isEmpty()).toList();
            add2DStingArray(node, "configPaths", filteredValidatedConfigPaths);
        } else if (isHidden) {
            node.putArray("configPaths");
        } else if (configRename.isPresent()) {
            node.put("configKey", configRename.get());
        }
        var deprecatedConfigsArray =
            persistor.map(FieldNodeSettingsPersistor::getConfigsDeprecations).orElse(new ConfigsDeprecation[0]);
        if (deprecatedConfigsArray.length > 0) {
            final var deprecatedConfigsNode = node.putArray("deprecatedConfigKeys");
            Arrays.stream(deprecatedConfigsArray)
                .forEach(deprecatedConfigs -> putDeprecatedConfig(deprecatedConfigsNode, deprecatedConfigs));
        }

    }

    private static boolean isNonInternal(final String key) {
        return !key.endsWith(SettingsModel.CFGKEY_INTERNAL);
    }

    private static String validateKey(final String key) {
        if (key.contains(".")) {
            throw new IllegalArgumentException(
                "Config key must not contain dots. If nested config keys are required, use getConfigPaths instead "
                    + "of getConfigKeys. Config key: " + key);
        }
        return key;
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
