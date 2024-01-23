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
 *   Jun 19, 2023 (hornm): created
 */
package org.knime.testing.node.dialog;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.util.workflow.def.FallibleSupplier;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;

/**
 * For testing that legacy settings can still be read and provide the expected defaults.
 * <p>
 * <b>Opening a dialog must never change the users configuration.</b> When adding functionality that subsumes the old
 * behavior, make sure that one of the settings reflects the old behavior and that this setting is active when loading
 * old node settings.
 * </p>
 * <h1>Example</h1>
 * <p>
 * The old regex split node produced an output table that had columns <code>split_0, split_1, ... </code>. After
 * migrating the dialog, the user can change the output structure. But when loading old settings that do not have the
 * new structure yet, we want to make sure that
 *
 * <pre>
 * settings.m_output.m_mode = OutputMode.COLUMNS;
 * settings.m_output.m_columnPrefixMode = ColumnPrefixMode.CUSTOM;
 * settings.m_output.m_columnPrefix = "split_";
 * </pre>
 * </p>
 *
 * @author Carl Witt, KNIME AG, Zurich, Switzerland
 */
@SuppressWarnings("restriction")
public abstract class DefaultNodeSettingsCompatibilityTest<T extends DefaultNodeSettings> {

    /** To specify an expected equivalence. */
    protected record Assert(FallibleSupplier<DefaultNodeSettings> actual, DefaultNodeSettings expected) {
        /**
         * @param input to be loaded into a DefaultNodeSettings instance
         * @param expected is expected to be equal to the created instance
         * @return new instance
         */
        public static Assert of(final NodeSettingsRO input, final DefaultNodeSettings expected) {
            return new Assert(from(input, expected.getClass()), expected);
        }
    }

    static FallibleSupplier<DefaultNodeSettings> from(final NodeSettingsRO nodeSettings,
        final Class<? extends DefaultNodeSettings> clazz) {
        return () -> DefaultNodeSettings.loadSettings(nodeSettings, clazz);
    }

    /** Creates a test that checks the equivalences defined in {@link #assertions()}. */
    protected DefaultNodeSettingsCompatibilityTest() {
    }

    /** @return the expected {@link DefaultNodeSettings} representation of given {@link NodeSettings}. */
    protected abstract List<Assert> assertions();

    /**
     * Compares the provided {@link DefaultNodeSettings} to the {@link DefaultNodeSettings} created from the provided
     * {@link NodeSettings} instances.
     *
     * @throws Exception
     */
    @Test
    protected void testEquality() throws Exception {
        List<Assert> assertions = assertions();
        for (var assertNumber = 0; assertNumber < assertions.size(); assertNumber++) {
            var assertion = assertions.get(assertNumber);
            final DefaultNodeSettings expected = assertion.expected();
            final var actual = assertion.actual().get();
            final var diff = DefaultNodeSettingsDiff.of(actual, expected);
            if (!diff.isEmpty()) {
                throw diff.toException("Assert %s failed. ".formatted(assertNumber));
            }
        }
    }

}
