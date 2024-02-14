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
 *   24 Jan 2024 (carlwitt): created
 */
package org.knime.testing.node.dialog;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.knime.core.data.DataTableSpec;
import org.knime.core.data.DataType;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.util.workflow.def.FallibleSupplier;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;

/**
 * @author Carl Witt, KNIME AG, Zurich, Switzerland
 */
@SuppressWarnings({"restriction"})
public final class SnapshotTestConfiguration {

    List<Snapshot> m_snapshotTests;

    private SnapshotTestConfiguration(final List<Snapshot> snapshotTests) {
        m_snapshotTests = snapshotTests;
    }

    /**
     * API for creating test configurations.
     *
     * @author Carl Witt, KNIME AG, Zurich, Switzerland
     */
    @SuppressWarnings("javadoc")
    public interface BuilderStage {

        /**
         * Specify the specs of the input ports that are used in
         * {@link DefaultNodeSettings#createDefaultNodeSettingsContext(PortObjectSpec[])}
         */
        interface OptionalInputTableSpec extends OptionalTests {
            /**
             * @param spec add a data table spec that is used to configure the settings. Specs will be provided to the
             *            settings in the order they are added in the builder.
             */
            OptionalInputTableSpec addInputTableSpec(DataTableSpec spec);

            /**
             * Convenience inline builder to add data table specs. Specs will be provided to the settings in the order
             * they are added in the builder.
             */
            ConfigureColumnNames addInputTableSpec();

            /** @param specs replaces all input specs with the given specs. */
            OptionalTests withInputPortObjectSpecs(PortObjectSpec[] specs);
        }

        /** Specify column names for the previous call to {@link OptionalInputTableSpec#addInputTableSpec()} */
        interface ConfigureColumnNames {
            /** @param columnNames for the input table spec */
            ConfigureDataTypes withColumnNames(String... columnNames);
        }

        /** Specify column data types for the previous call to {@link OptionalInputTableSpec#addInputTableSpec()} */
        interface ConfigureDataTypes {
            /** @param dataTypes for the table spec */
            OptionalInputTableSpec withTypes(DataType... dataTypes);
        }

        /** Optionally add a number of snapshot tests (json forms or node settings structure). Can build. */
        interface OptionalTests extends BuildStage {
            /**
             * Add a test for the JSON Forms representation of the given classes, specifying which {@link SettingsType}
             * the class represents.
             *
             * @param type of settings to test (view/model)
             * @param clazz of settings to test
             */
            OptionalTests testJsonForms(SettingsType type, Class<? extends DefaultNodeSettings> clazz);

            /**
             * Add a test for the JSON Forms representation of the given classes.
             *
             * @param map settings types and classes to test
             */
            OptionalTests testJsonForms(Map<SettingsType, Class<? extends DefaultNodeSettings>> clazzes);

            /**
             * Add a test for the JSON Forms representation of the given instance, specifying which {@link SettingsType}
             * the class represents.
             *
             * @param type of settings to test (view/model)
             * @param instance a provider of an instance to test
             */
            OptionalTests testJsonFormsWithInstance(SettingsType type, FallibleSupplier<DefaultNodeSettings> instance);

            /**
             * Add a test for the JSON Forms representation of the given instances.
             *
             * @param map settings types and instances to test
             */
            OptionalTests
                testJsonFormsWithInstances(Map<SettingsType, FallibleSupplier<DefaultNodeSettings>> instances);

            default OptionalTests testJsonFormsWithInstance(final SettingsType type,
                final DefaultNodeSettings instance) {
                return testJsonFormsWithInstance(type, () -> instance);
            }

            default OptionalTests testJsonFormsForModel(final Class<? extends DefaultNodeSettings> clazz) {
                return testJsonForms(Map.of(SettingsType.MODEL, clazz));
            }

            default OptionalTests testJsonFormsForModel(final DefaultNodeSettings instance) {
                return testJsonFormsWithInstance(SettingsType.MODEL, instance);
            }

            default OptionalTests testJsonFormsForView(final Class<? extends DefaultNodeSettings> clazz) {
                return testJsonForms(Map.of(SettingsType.VIEW, clazz));
            }

            default OptionalTests testJsonFormsForView(final DefaultNodeSettings instance) {
                return testJsonFormsWithInstance(SettingsType.VIEW, instance);
            }

            /**
             * Makes sure that the representation of a settings object loaded from legacy settings does not change.
             *
             * @param legacy internal settings structure
             * @param clazz to instantiante the settings object
             */
            OptionalTests testNodeSettingsStructure(NodeSettingsRO legacy,
                final Class<? extends DefaultNodeSettings> clazz);

            /**
             * Makes sure that the representation of a settings object does not change.
             *
             * @param instance to persist and check for changes
             */
            OptionalTests testNodeSettingsStructure(FallibleSupplier<DefaultNodeSettings> instance);

            /**
             * Makes sure that the representation of a settings object does not change.
             *
             * @param instance to persist and check for changes
             */
            default OptionalTests testNodeSettingsStructure(final DefaultNodeSettings instance) {
                return testNodeSettingsStructure(() -> instance);
            }
        }

        interface BuildStage {
            SnapshotTestConfiguration build();
        }

    }

    /**
     * @return builder for a configuration that defines what to test on the given class
     */
    public static BuilderStage.OptionalInputTableSpec builder() {
        return new BuilderImplementation();
    }

    private static final class BuilderImplementation implements //
        BuilderStage.OptionalInputTableSpec, //
        BuilderStage.ConfigureColumnNames, //
        BuilderStage.ConfigureDataTypes {

        private final List<FallibleSupplier<DefaultNodeSettings>> m_settingsAsserts = new ArrayList<>();

        private List<PortObjectSpec> m_portObjectSpecs = new ArrayList<>();

        private List<Map<SettingsType, FallibleSupplier<DefaultNodeSettings>>> m_jsonFormsTests = new ArrayList<>();

        private BuilderImplementation() {
        }

        @Override
        public BuilderStage.OptionalTests withInputPortObjectSpecs(final PortObjectSpec[] specs) {
            m_portObjectSpecs = List.of(specs);
            return this;
        }

        @Override
        public BuilderStage.OptionalInputTableSpec addInputTableSpec(final DataTableSpec spec) {
            m_portObjectSpecs.add(spec);
            return this;
        }

        @Override
        public BuilderStage.ConfigureColumnNames addInputTableSpec() {
            return names -> types -> this.addInputTableSpec(new DataTableSpec(names, types));
        }

        @Override
        public BuilderStage.ConfigureDataTypes withColumnNames(final String... columnNames) {
            // pulled in via closure in addInputTableSpec
            return this;
        }

        @Override
        public BuilderStage.OptionalInputTableSpec withTypes(final DataType... dataTypes) {
            // pulled in via closure in addInputTableSpec
            return this;
        }

        @Override
        public BuilderStage.OptionalTests
            testJsonForms(final Map<SettingsType, Class<? extends DefaultNodeSettings>> clazzes) {
            m_jsonFormsTests.add(clazzes.entrySet().stream()
                .map(e -> Map.entry(e.getKey(), (FallibleSupplier<DefaultNodeSettings>)() -> {
                    var nodeSettings = new NodeSettings("ignore");
                    // At this point, the port object specs are already configured.
                    var settingsObj = DefaultNodeSettings.createSettings(e.getValue(),
                        m_portObjectSpecs.toArray(PortObjectSpec[]::new));
                    DefaultNodeSettings.saveSettings(e.getValue(), settingsObj, nodeSettings);
                    return settingsObj;
                })).collect(Collectors.toMap(Entry::getKey, Entry::getValue)));
            return this;
        }

        @Override
        public BuilderStage.OptionalTests testJsonFormsWithInstance(final SettingsType type,
            final FallibleSupplier<DefaultNodeSettings> instance) {
            return testJsonFormsWithInstances(Map.of(type, instance));
        }

        @Override
        public BuilderStage.OptionalTests
            testJsonFormsWithInstances(final Map<SettingsType, FallibleSupplier<DefaultNodeSettings>> instances) {
            m_jsonFormsTests.add(instances);
            return this;
        }

        @Override
        public BuilderStage.OptionalTests testJsonForms(final SettingsType type,
            final Class<? extends DefaultNodeSettings> clazz) {
            return testJsonForms(Map.of(type, clazz));
        }

        @Override
        public BuilderStage.OptionalTests
            testNodeSettingsStructure(final FallibleSupplier<DefaultNodeSettings> instance) {
            m_settingsAsserts.add(instance);
            return this;
        }

        @Override
        public BuilderStage.OptionalTests testNodeSettingsStructure(final NodeSettingsRO legacy,
            final Class<? extends DefaultNodeSettings> clazz) {
            m_settingsAsserts.add(() -> DefaultNodeSettings.loadSettings(legacy, clazz));
            return this;
        }

        @Override
        public SnapshotTestConfiguration build() {
            List<Snapshot> snapshotTests = new ArrayList<>();

            for (var i = 0; i < m_jsonFormsTests.size(); i++) {
                snapshotTests.add(new JsonFormsSnapshot(i, m_jsonFormsTests.get(i),
                    m_portObjectSpecs.toArray(PortObjectSpec[]::new)));
            }

            for (var i = 0; i < m_settingsAsserts.size(); i++) {
                snapshotTests.add(new NodeSettingsSnapshot(i, m_settingsAsserts.get(i)));
            }

            return new SnapshotTestConfiguration(snapshotTests);
        }

    }

}
