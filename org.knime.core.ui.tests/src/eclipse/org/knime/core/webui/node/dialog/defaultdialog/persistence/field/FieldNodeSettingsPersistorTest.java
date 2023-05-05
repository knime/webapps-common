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
import static org.junit.jupiter.api.Assertions.assertInstanceOf;

import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistorWithConfigKey;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.FieldNodeSettingsPersistor;

/**
 * Contains unit tests for the {@link FieldNodeSettingsPersistor}.
 *
 * @author Benjamin Wilhelm, KNIME GmbH, Berlin, Germany
 */
class FieldNodeSettingsPersistorTest {

    @Test
    void testCreateInstance() {
        var persistor =
            FieldNodeSettingsPersistor.createInstance(CustomPersistor.class, Integer.class, "config_key_parameter");
        assertInstanceOf(CustomPersistor.class, persistor, "should return an instance of the specified class");
        assertArrayEquals(new String[]{"config_key_by_method"}, persistor.getConfigKeys(),
            "should use configKeys by the overwritten method");
    }

    @Test
    void testCreateInstanceWithConfigKey() {
        var persistor = FieldNodeSettingsPersistor.createInstance(CustomPersistorWithConfigKey.class, Integer.class,
            "config_key_parameter");
        assertInstanceOf(CustomPersistorWithConfigKey.class, persistor,
            "should return an instance of the specified class");
        assertArrayEquals(new String[]{"config_key_parameter"}, persistor.getConfigKeys(),
            "should set configKeys automatically");
    }

    private static class CustomPersistor implements FieldNodeSettingsPersistor<Integer> {

        @Override
        public Integer load(final NodeSettingsRO settings) throws InvalidSettingsException {
            throw new UnsupportedOperationException("not used by tests");
        }

        @Override
        public void save(final Integer obj, final NodeSettingsWO settings) {
            throw new UnsupportedOperationException("not used by tests");
        }

        @Override
        public String[] getConfigKeys() {
            return new String[]{"config_key_by_method"};
        }
    }

    private static class CustomPersistorWithConfigKey extends NodeSettingsPersistorWithConfigKey<Integer> {

        @Override
        public Integer load(final NodeSettingsRO settings) throws InvalidSettingsException {
            throw new UnsupportedOperationException("not used by tests");
        }

        @Override
        public void save(final Integer obj, final NodeSettingsWO settings) {
            throw new UnsupportedOperationException("not used by tests");
        }
    }
}
