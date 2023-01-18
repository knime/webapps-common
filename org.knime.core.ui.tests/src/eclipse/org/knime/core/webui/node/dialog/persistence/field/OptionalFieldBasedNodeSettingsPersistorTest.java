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
 */
package org.knime.core.webui.node.dialog.persistence.field;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.webui.node.dialog.impl.DefaultNodeSettings;

/**
 * Tests for the {@link OptionalFieldBasedNodeSettingsPersistor}.
 *
 * @author Paul Bärnreuther
 */
class OptionalFieldBasedNodeSettingsPersistorTest {

    private static final String ROOT_KEY = "Test";

    private static final class TestSettings implements DefaultNodeSettings {


        @SuppressWarnings("unused")
        int m_intSetting;

        @SuppressWarnings("unused")
        double m_doubleSetting;

        @SuppressWarnings("unused")
        long m_longSetting;

        @SuppressWarnings("unused")
        String m_stringSetting;

        @SuppressWarnings("unused")
        boolean m_booleanSetting;

        @SuppressWarnings("unused")
        String[] m_stringArraySetting;

        @SuppressWarnings("unused")
        double[] m_doubleArraySetting;

        void setDefaults() {
           m_intSetting = 0;
           m_stringSetting = "";
           m_longSetting = 0l;
           m_doubleSetting = 0d;
           m_booleanSetting = false;
           m_stringArraySetting = new String[0];
           m_doubleArraySetting = new double[0];
        }
    }

    @Test
    void testLoadWithDefaultValues() throws InvalidSettingsException {
        var persistor = new OptionalFieldBasedNodeSettingsPersistor<TestSettings>(TestSettings.class);

        var originallySaved = new NodeSettings(ROOT_KEY);
        var loaded = persistor.load(originallySaved);

        var expected = new TestSettings();
        expected.setDefaults();

        assertEquals(expected.m_intSetting, loaded.m_intSetting, "The loaded settings are not as expected");
        assertEquals(expected.m_doubleSetting, loaded.m_doubleSetting, "The loaded settings are not as expected");
        assertEquals(expected.m_longSetting, loaded.m_longSetting, "The loaded settings are not as expected");
        assertEquals(expected.m_stringSetting, loaded.m_stringSetting, "The loaded settings are not as expected");
        assertEquals(expected.m_booleanSetting, loaded.m_booleanSetting, "The loaded settings are not as expected");
        assertArrayEquals(expected.m_stringArraySetting, loaded.m_stringArraySetting, "The loaded settings are not as expected");
        assertArrayEquals(expected.m_doubleArraySetting, loaded.m_doubleArraySetting, "The loaded settings are not as expected");



    }

}
