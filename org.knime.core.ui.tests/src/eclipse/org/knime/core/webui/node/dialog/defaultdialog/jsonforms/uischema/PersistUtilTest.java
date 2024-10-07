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
 *   Oct 8, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.configmapping.ConfigsDeprecation;
import org.knime.core.webui.node.dialog.configmapping.ConfigsDeprecation.Builder;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.FieldNodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.persisttree.PersistTreeFactory;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

class PersistUtilTest {

    private static ObjectNode getPersistSchema(final Class<? extends PersistableSettings> settingsClass) {
        final var persistTree = new PersistTreeFactory().createTree(settingsClass);
        final var uischema = new ObjectMapper().createObjectNode();
        PersistUtil.addPersist(uischema, Map.of(SettingsType.MODEL, persistTree));
        return (ObjectNode)uischema.get("persist");
    }

    private static class SettingWithConfigKeyInPersistAnnotation implements PersistableSettings {

        @Persist(configKey = "my_config_key")
        @Widget(title = "my_title", description = "")
        public int test;
    }

    @Test
    void testConfigKeyFromPersistAnnotation() throws JsonProcessingException {
        final var result = getPersistSchema(SettingWithConfigKeyInPersistAnnotation.class);
        assertThatJson(result).inPath("$.properties.model.properties.test.configKeys").isArray().isEqualTo(new String[]{"my_config_key"});
    }

    private static class CustomPersistor implements FieldNodeSettingsPersistor<Integer> {

        @Override
        public Integer load(final NodeSettingsRO settings) throws InvalidSettingsException {
            throw new UnsupportedOperationException("should not be called by this test");
        }

        @Override
        public void save(final Integer obj, final NodeSettingsWO settings) {
            throw new UnsupportedOperationException("should not be called by this test");
        }

        @Override
        public String[] getConfigKeys() {
            return new String[]{"config_key_from_persistor_1", "config_key_from_persistor_2"};
        }

        @Override
        public String[][] getSubConfigKeys() {
            return new String[][]{{"custom", "sub", "config"}, {"keys", "from", "persistor"}};
        }
    }

    private static class SettingWithCustomPersistor implements PersistableSettings {

        @Persist(customPersistor = CustomPersistor.class)
        @Widget(title = "my_title", description = "")
        public int test;
    }

    @Test
    void testConfigKeyAndSubConfigKeysFromCustomPersistor() throws JsonProcessingException {
        final var result = getPersistSchema(SettingWithCustomPersistor.class);
        assertThatJson(result).inPath("$.properties.model.properties.test.configKeys").isArray()
            .isEqualTo(new String[]{"config_key_from_persistor_1", "config_key_from_persistor_2"});
        assertThatJson(result).inPath("$.properties.model.properties.test.subConfigKeys").isArray()
            .isEqualTo(new String[][]{{"custom", "sub", "config"}, {"keys", "from", "persistor"}});

    }

    private static class CustomPersistorWithDeprecatedConfigs implements FieldNodeSettingsPersistor<Integer> {

        @Override
        public Integer load(final NodeSettingsRO settings) throws InvalidSettingsException {
            throw new UnsupportedOperationException("should not be called by this test");
        }

        @Override
        public void save(final Integer obj, final NodeSettingsWO settings) {
            throw new UnsupportedOperationException("should not be called by this test");
        }

        @Override
        public String[] getConfigKeys() {
            return new String[0];
        }

        @Override
        public ConfigsDeprecation[] getConfigsDeprecations() {
            return new ConfigsDeprecation[]{//
                new Builder()//
                    .forDeprecatedConfigPath("A", "B")//
                    .forDeprecatedConfigPath("C")//
                    .forNewConfigPath("D", "E")//
                    .forNewConfigPath("F")//
                    .build(), //
                new Builder()//
                    .forNewConfigPath("I", "J")//
                    .forDeprecatedConfigPath("G", "H")//
                    .build()//
            };
        }

    }

    private static class SettingWithCustomPersistorWithDeprecatedConfigs implements PersistableSettings {

        @Persist(customPersistor = CustomPersistorWithDeprecatedConfigs.class)
        @Widget(title = "my_title", description = "")
        public int test;
    }

    @Test
    void testConfigKeyFromCustomPersistorWithDeprecatedConfigs() throws JsonProcessingException {
        final var result = getPersistSchema(SettingWithCustomPersistorWithDeprecatedConfigs.class);
        assertThatJson(result).inPath("$.properties.model.properties.test.deprecatedConfigKeys").isArray().hasSize(2);
        assertThatJson(result).inPath("$.properties.model.properties.test.deprecatedConfigKeys[0].deprecated").isArray()
            .isEqualTo(new String[][]{{"A", "B"}, {"C"}});
        assertThatJson(result).inPath("$.properties.model.properties.test.deprecatedConfigKeys[0].new").isArray()
            .isEqualTo(new String[][]{{"D", "E"}, {"F"}});
        assertThatJson(result).inPath("$.properties.model.properties.test.deprecatedConfigKeys[1].deprecated").isArray()
            .isEqualTo(new String[][]{{"G", "H"}});
        assertThatJson(result).inPath("$.properties.model.properties.test.deprecatedConfigKeys[1].new").isArray()
            .isEqualTo(new String[][]{{"I", "J"}});
    }
}
