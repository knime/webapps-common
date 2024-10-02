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

import java.util.function.Supplier;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.widget.TextInputWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.SimpleButtonWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ButtonReference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Reference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueReference;
import org.knime.testing.node.dialog.updates.TestSettings.ElementSettings.ElementTextProvider.ElementValueReference;
import org.knime.testing.node.dialog.updates.TestSettings.MyTextProvider.MyButtonRef;
import org.knime.testing.node.dialog.updates.TestSettings.MyTextProvider.MyValueRef;

@SuppressWarnings("restriction")
class TestSettings implements DefaultNodeSettings {

    static abstract class MyTextProvider implements StateProvider<String> {

        static final class MyButtonRef implements ButtonReference {
        }

        static final class MyValueRef implements Reference<String> {
        }

        protected Supplier<String> m_supplier;

        @Override
        public void init(final StateProviderInitializer initializer) {
            initializer.computeBeforeOpenDialog();
            initializer.computeAfterOpenDialog();
            m_supplier = initializer.computeFromValueSupplier(MyValueRef.class);
            initializer.computeOnButtonClick(MyButtonRef.class);
        }

        @Override
        public String computeState(final DefaultNodeSettingsContext context) {
            return m_supplier.get();
        }

    }

    static final class ElementSettings implements WidgetGroup {

        public ElementSettings(final String dependency) {
            m_elementDependency = dependency;
        }

        abstract static class ElementTextProvider extends MyTextProvider {

            static final class ElementValueReference implements Reference<String> {
            }

            private Supplier<String> m_elementDependencySupplier;

            @Override
            public void init(final StateProviderInitializer initializer) {
                super.init(initializer);
                m_elementDependencySupplier = initializer.computeFromValueSupplier(ElementValueReference.class);
            }

            @Override
            public String computeState(final DefaultNodeSettingsContext context) {
                return m_supplier.get() + ", " + m_elementDependencySupplier.get();
            }

        }

        static final class ElementPlaceholderProvider extends ElementTextProvider {

        }

        static final class ElementTextValueProvider extends ElementTextProvider {

        }

        @ValueReference(ElementValueReference.class)
        String m_elementDependency;

        @TextInputWidget(placeholderProvider = ElementPlaceholderProvider.class)
        @ValueProvider(ElementTextValueProvider.class)
        String m_elementField;

    }

    @SimpleButtonWidget(ref = MyButtonRef.class)
    Void m_button;

    @ValueReference(MyValueRef.class)
    String m_dependency;

    ElementSettings[] m_array;

    static final class PlaceholderProvider extends MyTextProvider {

    }

    static final class TextValueProvider extends MyTextProvider {

    }

    @TextInputWidget(placeholderProvider = PlaceholderProvider.class)
    @ValueProvider(TextValueProvider.class)
    String m_field;

}
