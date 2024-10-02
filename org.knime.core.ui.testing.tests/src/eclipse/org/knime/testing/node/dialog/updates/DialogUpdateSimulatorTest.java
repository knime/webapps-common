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
 *   Oct 2, 2024 (Paul Bärnreuther): created
 */
package org.knime.testing.node.dialog.updates;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.IndexedValue;
import org.knime.testing.node.dialog.updates.TestSettings.ElementSettings;
import org.knime.testing.node.dialog.updates.TestSettings.MyTextProvider.MyButtonRef;
import org.knime.testing.node.dialog.updates.TestSettings.MyTextProvider.MyValueRef;
import org.knime.testing.node.dialog.updates.UpdateSimulator.UpdateSimulatorResult;

@SuppressWarnings("restriction")
class DialogUpdateSimulatorTest {

    private TestSettings m_settings;

    private DialogUpdateSimulator m_simulator;

    static final String DEPENDENCY = "dependency";

    static final String FIRST = "first";

    static final String SECOND = "second";

    @BeforeEach
    void setUp() {
        m_settings = new TestSettings();
        m_simulator = new DialogUpdateSimulator(m_settings, null);
        m_settings.m_dependency = DEPENDENCY;
        m_settings.m_array = new ElementSettings[]{new ElementSettings(FIRST), new ElementSettings(SECOND)};
    }

    static final List<List<String>> PATH_TO_ELEMENT_FIELD = List.of(List.of("array"), List.of("elementField"));

    static void assertResults(final UpdateSimulatorResult updateSimulatorResult) {
        assertThat(updateSimulatorResult.getValueUpdateAt("field")).isEqualTo(DEPENDENCY);
        assertThat(updateSimulatorResult.getUiStateUdateAt(TestSettings.PlaceholderProvider.class))
            .isEqualTo(DEPENDENCY);
        final var multiValueUpdate = updateSimulatorResult.getMultiValueUpdatesInArrayAt(PATH_TO_ELEMENT_FIELD);
        final var multiUiStateUpdate = updateSimulatorResult
            .getMultiUiStateUpdateAt(TestSettings.ElementSettings.ElementPlaceholderProvider.class);

        assertArrayResults(multiValueUpdate);
        assertArrayResults(multiUiStateUpdate);
    }

    static void assertArrayResults(final List<IndexedValue<Integer>> multiValueUpdate) {
        assertThat(multiValueUpdate).hasSize(2);
        assertThat(multiValueUpdate.get(0).value()).isEqualTo(DEPENDENCY + ", " + FIRST);
        assertThat(multiValueUpdate.get(1).value()).isEqualTo(DEPENDENCY + ", " + SECOND);
    }

    @Test
    void testBeforeOpenDialog() {
        assertResults(m_simulator.simulateBeforeOpenDialog());
    }

    @Test
    void testAfterOpenDialog() {
        assertResults(m_simulator.simulateAfterOpenDialog());
    }

    @Test
    void testSimulateButtonClick() {
        assertResults(m_simulator.simulateButtonClick(MyButtonRef.class));
    }

    @Test
    void testSimulateValueChange() {
        assertResults(m_simulator.simulateValueChange(MyValueRef.class));
    }

    @Test
    void testTriggerFromWithinAnArray() {
        final var result = m_simulator
            .simulateValueChange(TestSettings.ElementSettings.ElementTextProvider.ElementValueReference.class, 1);
        assertThat(result.getValueUpdatesInArrayAt(PATH_TO_ELEMENT_FIELD)).isEqualTo(DEPENDENCY + ", " + SECOND);
    }

}
