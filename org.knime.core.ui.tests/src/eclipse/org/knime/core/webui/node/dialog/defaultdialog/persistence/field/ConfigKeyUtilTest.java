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
 *   Feb 9, 2023 (benjamin): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.persistence.field;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.configmapping.ConfigPath;
import org.knime.core.webui.node.dialog.configmapping.ConfigsDeprecation;
import org.knime.core.webui.node.dialog.configmapping.NewAndDeprecatedConfigPaths;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.persisttree.PersistTreeFactory;
import org.knime.core.webui.node.dialog.defaultdialog.tree.Tree;
import org.knime.core.webui.node.dialog.defaultdialog.tree.TreeNode;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;

/**
 * Contains unit tests for the {@link ConfigKeyUtil}.
 *
 * @author Benjamin Wilhelm, KNIME GmbH, Berlin, Germany
 */
class ConfigKeyUtilTest {

    private static class CustomPersistor implements FieldNodeSettingsPersistor<Integer> {

        @Override
        public Integer load(final NodeSettingsRO settings) throws InvalidSettingsException {
            throw new UnsupportedOperationException("not used by the tests");
        }

        @Override
        public void save(final Integer obj, final NodeSettingsWO settings) {
            throw new UnsupportedOperationException("not used by the tests");
        }

        @Override
        public String[] getConfigKeys() {
            return new String[]{"custom_key0", "custom_key1"};
        }

        @Override
        public List<ConfigsDeprecation<Integer>> getConfigsDeprecations() {
            return List.of(new ConfigsDeprecation.Builder<Integer>(settings -> {
                throw new IllegalStateException("Should not be called within this test");
            }).linkingNewAndDeprecatedConfigPaths(new NewAndDeprecatedConfigPaths.Builder()
                .withNewConfigPath("custom_key0").withDeprecatedConfigPath("old_config_key").build()).build());
        }

    }

    private static class Settings implements PersistableSettings {

        @Widget(title = "", description = "")
        int setting0;

        @Widget(title = "", description = "")
        int m_setting1;

        @Persist
        @Widget(title = "", description = "")
        int setting2;

        @Persist(configKey = "foo")
        @Widget(title = "", description = "")
        int setting3;

        @Persist(hidden = true)
        @Widget(title = "", description = "")
        int setting4;

        @Persist(customPersistor = CustomPersistor.class)
        @Widget(title = "", description = "")
        int setting5;

    }

    @Test
    void testConfigKeyFromFieldName() throws NoSuchFieldException, SecurityException {
        assertEquals("setting0", configKeyFor("setting0"), "should use field name for config key");
    }

    @Test
    void testConfigKeyFromFieldNameRemovePrefix() throws NoSuchFieldException, SecurityException {
        assertEquals("setting1", configKeyFor("setting1"), "should remove 'm_' prefix from field name for config key");
    }

    @Test
    void testConfigKeyFromFieldNameWithPersist() throws NoSuchFieldException, SecurityException {
        assertEquals("setting2", configKeyFor("setting2"), "should use field name for config key");
    }

    @Test
    void testConfigKeyFromPersistAnnotation() throws NoSuchFieldException, SecurityException {
        assertEquals("foo", configKeyFor("setting3"), "should extract custom configKey from annotation");
    }

    @Test
    void testConfigKeyForHidden() throws NoSuchFieldException, SecurityException {
        assertEquals("setting4_Internals", configKeyFor("setting4"),
            "should append '_Internals' to hidden settings config keys");
    }

    private static String configKeyFor(final String fieldName) throws NoSuchFieldException {
        return ConfigKeyUtil.getConfigKey(getField(fieldName));
    }

    @Test
    void testConfigKeysUsedWithoutPersist() throws NoSuchFieldException {
        assertArrayEquals(new String[][]{{"setting0"}}, usedConfigPathsFor("setting0"),
            "configKeys should be emtpy for settings without annotation");
    }

    @Test
    void testConfigKeysUsedWithOnlyPersist() throws NoSuchFieldException {
        assertArrayEquals(new String[][]{{"setting2"}}, usedConfigPathsFor("setting2"),
            "configKeys should be field name for settings without custom key or persistor");
    }

    @Test
    void testConfigKeysUsedWithCustomKey() throws NoSuchFieldException {
        assertArrayEquals(new String[][]{{"foo"}}, usedConfigPathsFor("setting3"),
            "configKeys should contain the custom key from the annotation");
    }

    @Test
    void testConfigKeysUsedWithCustomPersistor() throws NoSuchFieldException {
        assertArrayEquals(new String[][]{{"custom_key0"}, {"custom_key1"}}, usedConfigPathsFor("setting5"),
            "configKeys should come from the custom persistor");
    }

    @Test
    void testDeprecatedConfigKeysFromCustomPersistor() throws NoSuchFieldException {
        final var deprecatedConfigKeys = deprecatedConfigKeysFor("setting5");
        assertArrayEquals(new String[]{"custom_key0"}, getFirstPathAsArray(deprecatedConfigKeys.get(0).stream()
            .flatMap(newAndDeprecatedConfigPaths -> newAndDeprecatedConfigPaths.getNewConfigPaths().stream()).toList()),
            "newConfigPaths of deprecatedConfigs should be set from custom persistor");
        assertArrayEquals(new String[]{"old_config_key"},
            getFirstPathAsArray(deprecatedConfigKeys.get(0).stream()
                .flatMap(newAndDeprecatedConfigPaths -> newAndDeprecatedConfigPaths.getDeprecatedConfigPaths().stream())
                .toList()),
            "deprecatedConfigPaths of deprecatedConfigs should be set from custom persistor");
    }

    private static String[] getFirstPathAsArray(final Collection<ConfigPath> configPaths) {
        return configPaths.stream().findFirst().orElseThrow().path().toArray(String[]::new);
    }

    private static String[][] usedConfigPathsFor(final String fieldName) throws NoSuchFieldException {
        return getConfigPathsUsedByField(getField(fieldName));
    }

    private static List<Collection<NewAndDeprecatedConfigPaths>> deprecatedConfigKeysFor(final String fieldName)
        throws NoSuchFieldException {
        return getDeprecatedConfigsUsedByField(getField(fieldName));
    }

    /**
     * @param node
     * @return the config key used by the persistor or the default key if none is set
     */
    static String[][] getConfigPathsUsedByField(final TreeNode<PersistableSettings> node) {
        var configKey = ConfigKeyUtil.getConfigKey(node);
        final var singleConfigKeyPath = new String[][]{{configKey}};
        var persist = node.getAnnotation(Persist.class);
        if (persist.isPresent()) {
            var customPersistor = persist.get().customPersistor();
            if (!customPersistor.equals(FieldNodeSettingsPersistor.class)) {
                return ConfigKeyUtil.extractFieldNodeSettingsPersistor(node)
                    .map(FieldNodeSettingsPersistor::getConfigPaths).orElse(singleConfigKeyPath);
            }
        }
        return singleConfigKeyPath;
    }

    /**
     * Get the collection of {@link ConfigsDeprecation} that are used by the given field if it is annotated with a
     * {@link Persist} annotation.
     *
     * @param node
     * @return the deprecated configs defined by the {@link Persist#customPersistor} or an empty array none exists.
     */
    @SuppressWarnings("unchecked")
    static List<Collection<NewAndDeprecatedConfigPaths>>
        getDeprecatedConfigsUsedByField(final TreeNode<PersistableSettings> node) {
        var persist = node.getAnnotation(Persist.class);
        if (persist.isEmpty()) {
            return Collections.emptyList();
        }
        return ConfigKeyUtil.extractFieldNodeSettingsPersistor(node).map(persistor -> persistor.getConfigsDeprecations()
            .stream().map(ConfigsDeprecation::getNewAndDeprecatedConfigPaths).toList()).orElse(Collections.emptyList());
    }

    private static Tree<PersistableSettings> SETTINGS_TREE;

    @BeforeAll
    static void createSettingsTree() {
        SETTINGS_TREE = new PersistTreeFactory().createTree(Settings.class);
    }

    private static TreeNode<PersistableSettings> getField(final String fieldName) throws NoSuchFieldException {
        return SETTINGS_TREE.getChildByName(fieldName);
    }
}
