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
 *   Jan 5, 2022 (hornm): created
 */
package org.knime.core.webui.node.dialog.defaultdialog;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.knime.core.data.DataTableSpec;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeLogger;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.util.CheckUtils;
import org.knime.core.node.workflow.FlowObjectStack;
import org.knime.core.node.workflow.FlowVariable;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.node.workflow.VariableType;
import org.knime.core.webui.node.dialog.defaultdialog.layout.LayoutGroup;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistorFactory;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter.ColumnFilter;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.ColumnSelection;
import org.knime.core.webui.node.dialog.defaultdialog.util.InstantiationUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ArrayWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Label;
import org.knime.core.webui.node.dialog.defaultdialog.widget.NumberInputWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.RadioButtonsWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.TextInputWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ValueSwitchWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonWidget;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Marker interface for implementations that define a {@link DefaultNodeDialog}. The implementations allow one to
 * declare the dialog's settings and widgets in a compact manner.
 *
 * <h3>Constructors and fields</h3>
 * <p>
 * The implementations must follow the following conventions:
 * <ol>
 * <li>It must provide an empty constructor and optionally a constructor that receives a
 * {@link SettingsCreationContext}.
 * <li>Fields must be of any of the following supported types:
 * <ul>
 * <li>boolean, int, long, double, float, String, char, or byte
 * <li>POJOs, arrays or Collections holding other supported types
 * </ul>
 * <li>Fields should be initialized with proper default values.
 * <ul>
 * <li>If no default value is provided, then the Java default is used
 * <li>Make sure that the persistors of non-primitive fields support null values if no proper default is provided
 * </ul>
 * </ol>
 * <h3>Dialog widgets</h3>
 * <p>
 * All fields with visibility of at least 'package scope' are represented as dialog widgets; they can optionally be
 * annotated with {@link Widget} and {@link org.knime.core.webui.node.dialog.defaultdialog.widget other widget
 * annotations} to supply additional information (e.g. description, domain info, ...).
 * Note that getters of at least 'package scope' will also be represented as dialog widgets. If this is not intended,
 * they can be annotated by an {@link JsonIgnore} annotation.
 *
 * The table below lists all the supported type with
 * <ul>
 * <li>the default widget being displayed if no specific widget annotation is given</li>
 * <li>the widget annotations that are compatible with the type</li>
 * </ul>
 *
 * <table border="1" cellpadding="3" cellspacing="0">
 * <caption>Type to Widget Mapping</caption>
 * <tr>
 * <th>Type</th>
 * <th>Default Widget</th>
 * <th>Compatible widget annotations</th>
 * </tr>
 * <tr>
 * <td>boolean</td>
 * <td>Checkbox</td>
 * <td></td>
 * </tr>
 * <tr>
 * <td>byte, int, long, double, float</td>
 * <td>Number Input</td>
 * <td>{@link NumberInputWidget}</td>
 * </tr>
 * <tr>
 * <td>String</td>
 * <td>Text Input</td>
 * <td>{@link ChoicesWidget} (twin-list)<br>
 * {@link TextInputWidget}</td>
 * </tr>
 * <tr>
 * <td>String[]</td>
 * <td></td>
 * <td>{@link ChoicesWidget} (drop-down)</td>
 * </tr>
 * <tr>
 * <td>Enums(*)</td>
 * <td>Drop Down </td>
 * <td>{@link ValueSwitchWidget}<br>
 * {@link RadioButtonsWidget}</td>
 * </tr>
 * <tr>
 * <td>Arrays/Collections of objects(**)</td>
 * <td>Array Widget</td>
 * <td>{@link ArrayWidget}</td>
 * </tr>
 * <tr>
 * <td>{@link ColumnSelection}</td>
 * <td></td>
 * <td>{@link ChoicesWidget} (drop-down)</td>
 * </tr>
 * <tr>
 * <td>{@link ColumnFilter}</td>
 * <td></td>
 * <td>{@link ChoicesWidget} (twin-list)</td>
 * </tr>
 * <tr>
 * <td>Any type</td>
 * <td>-</td>
 * <td>{@link ButtonWidget} (button with backend-side action handler)</td>
 * </tr>
 * </table>
 *
 * <p>
 * (*) Note on enums: In order to control the labels of enum-values to be used within the respective widget (e.g. Value
 * Switch), the {@link Label}-annotation can be used.
 * </p>
 * <p>
 * (**) Note on arrays: To be more precise, the elements of an array need to be serialized to an Object, i.e. arrays of
 * Strings or boxed types will not lead to an array layout. Instead these need to be wrapped inside a class.
 * </p>
 *
 * <h4>Nested settings</h4> For nested fields to be transformed to dialog widgets themselves the containing class has to
 * be annotated with {@link LayoutGroup}
 *
 * <h4>Layouting</h4> Additional annotations can be used to set the layouting for the generated dialog. See the
 * {@link org.knime.core.webui.node.dialog.defaultdialog.layout layout package} for further information. The class of
 * the elements of an arrays are treated as self-contained settings with their own layouting.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
public interface DefaultNodeSettings extends PersistableSettings {

    /**
     * A context that holds any available information that might be relevant for creating a new instance of
     * {@link DefaultNodeSettings}.
     */
    final class SettingsCreationContext {

        private final PortObjectSpec[] m_specs;

        private final FlowObjectStack m_stack;

        public SettingsCreationContext(final PortObjectSpec[] specs, final FlowObjectStack stack) {
            m_specs = specs;
            m_stack = stack;
        }

        /**
         * @return the input {@link PortObjectSpec PortObjectSpecs} of the node; NOTE: array of specs can contain
         *         {@code null} values, e.g., if input port is not connected!
         */
        public PortObjectSpec[] getPortObjectSpecs() {
            return m_specs;
        }

        /**
         * @param portIndex the port for which to retrieve the spec
         * @return the {@link PortObjectSpec} at the given portIndex or {@link Optional#empty()} if it is not available
         * @throws IndexOutOfBoundsException if the portIndex does not match the ports of the node
         */
        public Optional<PortObjectSpec> getPortObjectSpec(final int portIndex) {
            return Optional.ofNullable(m_specs[portIndex]);
        }

        /**
         * @return the input {@link DataTableSpec DataTableSpecs} of the node; NOTE: array of specs can contain
         *         {@code null} values, e.g., if input port is not connected!
         * @throws ClassCastException if any of the node's input ports does not hold a {@link DataTableSpec}
         */
        public DataTableSpec[] getDataTableSpecs() {
            return Arrays.stream(m_specs).map(DataTableSpec.class::cast).toArray(DataTableSpec[]::new);
        }

        /**
         * @param portIndex the port for which to retrieve the spec
         * @return the {@link DataTableSpec} at the given portIndex or {@link Optional#empty()} if it is not available
         * @throws ClassCastException if the requested port is not a table port
         * @throws IndexOutOfBoundsException if the portIndex does not match the ports of the node
         */
        public Optional<DataTableSpec> getDataTableSpec(final int portIndex) {
            return getPortObjectSpec(portIndex).map(DataTableSpec.class::cast);
        }

        /**
         * @param name the name of the variable
         * @param type the {@link VariableType} of the variable
         * @param <T> the simple value type of the variable
         * @return the simple non-null value of the top-most variable with the argument name and type, if present,
         *         otherwise an empty {@link Optional}
         * @throws NullPointerException if any argument is null
         * @see FlowObjectStack#peekFlowVariable(String, VariableType)
         */
        public <T> Optional<T> peekFlowVariable(final String name, final VariableType<T> type) {
            return m_stack.peekFlowVariable(name, type).map(flowVariable -> flowVariable.getValue(type));
        }

        /**
         * @param types the {@link VariableType VariableTypes} of the requested {@link FlowVariable FlowVariables}
         * @return the non-null read-only map of flow variable name -&gt; {@link FlowVariable}
         * @throws NullPointerException if the argument is null
         * @see FlowObjectStack#getAvailableFlowVariables(VariableType[])
         */
        public Map<String, FlowVariable> getAvailableInputFlowVariables(final VariableType<?>... types) {
            Objects.requireNonNull(types, () -> "Variable types must not be null.");
            return Collections.unmodifiableMap(Optional.ofNullable(m_stack)
                .map(stack -> stack.getAvailableFlowVariables(types)).orElse(Collections.emptyMap()));
        }

        /**
         * @return the names of the available flow variables or an empty array if there are no flow variables available
         */
        public String[] getAvailableFlowVariableNames() {
            return m_stack != null ? m_stack.getAllAvailableFlowVariables().keySet().toArray(String[]::new)
                : new String[0];
        }

    }

    /**
     * Verifies a given node settings implementation, making sure that it follows the contract of
     * {@link DefaultNodeSettings}, as defined in its documentation.
     *
     * @param settingsClass the settings class to verify
     */
    static void verifySettings(final Class<? extends DefaultNodeSettings> settingsClass) {
        try {
            settingsClass.getDeclaredConstructor();
        } catch (NoSuchMethodException e) {
            NodeLogger.getLogger(DefaultNodeSettings.class).errorWithFormat(
                "Default node settings class %s does not provide a default constructor.",
                settingsClass.getSimpleName());
        } catch (SecurityException e) {
            NodeLogger.getLogger(DefaultNodeSettings.class)
                .error(String.format(
                    "Exception when attempting to access default constructor of default node settings class %s.",
                    settingsClass.getSimpleName()), e);
        }
    }

    /**
     * Helper to serialize a {@link DefaultNodeSettings} of specified class from a {@link NodeSettingsRO}-object.
     *
     * @param <S>
     * @param settings the settings-object to create the instance from
     * @param clazz default node settings class
     * @return a new {@link DefaultNodeSettings}-instance
     * @throws InvalidSettingsException if the settings are invalid
     */
    static <S extends DefaultNodeSettings> S loadSettings(final NodeSettingsRO settings, final Class<S> clazz)
        throws InvalidSettingsException {
        return NodeSettingsPersistorFactory.getPersistor(clazz).load(settings);
    }

    /**
     * Helper to create a new {@link DefaultNodeSettings} of the specified type.
     *
     * @param <S>
     * @param clazz default node settings class
     * @param specs the specs with which to create the settings. NOTE: can contain {@code null} values, e.g., if input
     *            port is not connected
     * @return a new {@link DefaultNodeSettings}-instance
     */
    static <S extends DefaultNodeSettings> S createSettings(final Class<S> clazz, final PortObjectSpec[] specs) {
        return InstantiationUtil.createDefaultNodeSettings(clazz, createSettingsCreationContext(specs));
    }

    /**
     * Creates a new {@link DefaultNodeSettings} object of the specified type.
     *
     * @param <S> the type of DefaultNodeSettings
     * @param clazz the class of the DefaultNodeSettings type
     * @return a new instance of the DefaultNodeSettingsType
     */
    static <S extends DefaultNodeSettings> S createSettings(final Class<S> clazz) {
        return InstantiationUtil.createInstance(clazz);
    }

    /**
     * Helper to serialize a {@link DefaultNodeSettings}-instance into a {@link NodeSettingsWO}-object.
     *
     * @param settingsClass the setting object's class
     * @param settingsObject the default node settings object to serialize
     * @param settings the settings to write to
     */
    static void saveSettings(final Class<? extends DefaultNodeSettings> settingsClass,
        final DefaultNodeSettings settingsObject, final NodeSettingsWO settings) {
        castAndSaveSettings(settingsClass, settingsObject, settings);
    }

    @SuppressWarnings("unchecked") // we check that the cast is save
    private static <S extends DefaultNodeSettings> void castAndSaveSettings(final Class<S> settingsClass,
        final DefaultNodeSettings settingsObject, final NodeSettingsWO settings) {
        CheckUtils.checkArgument(settingsClass.isInstance(settingsObject),
            "The provided settingsObject is not an instance of the provided settingsClass.");
        NodeSettingsPersistorFactory.getPersistor(settingsClass).save((S)settingsObject, settings);

    }

    /**
     * Method to create a new {@link SettingsCreationContext} from input {@link PortObjectSpec PortObjectSpecs}.
     *
     * @param specs the non-null specs with which to create the schema
     * @return the newly created context
     * @throws NullPointerException if the argument is null
     */
    static SettingsCreationContext createSettingsCreationContext(final PortObjectSpec[] specs) {
        Objects.requireNonNull(specs, () -> "Port object specs must not be null.");
        final var nodeContext = NodeContext.getContext();
        return new SettingsCreationContext(specs,
            nodeContext == null ? null : nodeContext.getNodeContainer().getFlowObjectStack());
    }

}
