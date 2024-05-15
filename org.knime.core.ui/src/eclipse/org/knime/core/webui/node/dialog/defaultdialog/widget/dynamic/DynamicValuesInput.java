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
 *   15 May 2024 (Manuel Hotz, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.dynamic;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.knime.core.data.DataCell;
import org.knime.core.data.DataType;
import org.knime.core.data.DataTypeRegistry;
import org.knime.core.data.convert.datacell.JavaToDataCellConverterRegistry;
import org.knime.core.data.convert.java.DataCellToJavaConverterRegistry;
import org.knime.core.data.def.DoubleCell;
import org.knime.core.data.def.StringCell;
import org.knime.core.node.ExecutionContext;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.Persistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.DefaultFieldNodeSettingsPersistorFactory;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;

/**
 *
 * @author Paul Bärnreuther
 * @author Manuel Hotz, KNIME GmbH, Konstanz, Germany
 */
public class DynamicValuesInput implements PersistableSettings {

    public DynamicValuesInput() {
        m_values = new DynamicValue[]{new DynamicValue(new StringCell("").getType()),
            new DynamicValue(new DoubleCell(12.5).getType())};
        m_inputKind = InputKind.Single;
    }

    public DynamicValuesInput(final DataType singleValue) {
        m_values = new DynamicValue[]{new DynamicValue(singleValue)};
        m_inputKind = InputKind.Single;
    }

    static Map<String, DataType> knownDataTypes = new ConcurrentHashMap<>();

    DynamicValue[] m_values;

    String m_valueType;

    InputKind m_inputKind;

    enum InputKind {
            Single, Double, Collection
    }

    static class ModifyersRegistry {
        static Map<String, Class<? extends DefaultNodeSettings>> modifierClasses = Map.of();
    }

    @Persistor(DynamicValue.Persistor.class)
    public static class DynamicValue implements PersistableSettings {

        Optional<DataCell> m_cell = Optional.empty();

        DataType m_type;

        Optional<DefaultNodeSettings> m_modifiers = Optional.empty();

        DynamicValue() {
            // For Deserialization
        }

        /**
         * Value with content. Can be used to supply initial value.
         *
         * @param dataCell cell specifying the content (and type)
         */
        private DynamicValue(final DataCell dataCell, final DefaultNodeSettings modifiers) {
            m_cell = Optional.of(dataCell);
            m_type = dataCell.getType();
            m_modifiers = Optional.ofNullable(modifiers);
        }

        /**
         * Value without content. Default content will be supplied by dialog.
         *
         * @param type type of the content
         */
        public DynamicValue(final DataType type) {
            m_type = type;
        }

        /**
         * Value without content. Default content will be supplied by dialog.
         *
         * @param type type of the content
         */
        public DynamicValue(final DataType type, final DefaultNodeSettings modifiers) {
            m_type = type;
            m_modifiers = Optional.ofNullable(modifiers);
        }

        /**
         * Adds serialization logic for the {@link DynamicValue}s within a {@link DynamicValuesInput}
         *
         * @param module
         */
        public static void addSerializerAndDeserializer(final SimpleModule module) {
            module.addSerializer(DynamicValue.class, new DynamicValueSerializer());
            module.addDeserializer(DynamicValue.class, new DynamicValueDeserializer());
        }

        @FunctionalInterface
        interface ConsumerWithException<T, E extends Exception> {

            void accept(T t) throws E;
        }

        @FunctionalInterface
        interface SupplierWithException<T, E extends Exception> {

            T get() throws E;
        }

        private static <E extends Exception> void writeDataCell(final DataCell dataCell,
            final ConsumerWithException<Double, E> writeDouble, final ConsumerWithException<String, E> writeString)
            throws Exception {
            if (dataCell instanceof DoubleCell doubleCell) {
                writeDouble.accept(doubleCell.getDoubleValue());
            } else {
                writeString.accept(getStringFromDataCell(dataCell));
            }

        }

        private static String getStringFromDataCell(final DataCell dataCell) throws Exception {
            final var registry = DataCellToJavaConverterRegistry.getInstance();
            final var converter = registry.getConverterFactories(dataCell.getType(), String.class).stream().findFirst()
                .orElseThrow().create();
            return converter.convertUnsafe(dataCell);

        }

        private static <E extends Exception> DataCell readDataCell(final DataType dataType,
            final SupplierWithException<Double, E> readDouble, final SupplierWithException<String, E> readString)
            throws Exception {
            if (dataType.equals(DoubleCell.TYPE)) {
                return new DoubleCell(readDouble.get());
            } else {
                return readDataCellFromString(dataType, readString.get());
            }

        }

        private static DataCell readDataCellFromString(final DataType dataType, final String value) throws Exception {
            final var registry = JavaToDataCellConverterRegistry.getInstance();
            final var converter = registry.getConverterFactories(String.class, dataType).stream().findFirst()
                .orElseThrow().create((ExecutionContext)null);
            return converter.convert(value);

        }

        static class DynamicValueSerializer extends JsonSerializer<DynamicValue> {

            @Override
            public void serialize(final DynamicValue value, final JsonGenerator gen,
                final SerializerProvider serializers) throws IOException {

                final var cellClassName = value.m_type.getCellClass().getName();
                knownDataTypes.put(cellClassName, value.m_type);
                gen.writeStartObject();
                if (value.m_cell.isPresent()) {
                    gen.writeFieldName("value");
                    try {
                        DynamicValue.<IOException> writeDataCell(value.m_cell.get(), gen::writeNumber,
                            gen::writeString);
                    } catch (Exception ex) {
                        throw new IOException("Could not serialize data cell.", ex);
                    }
                }
                gen.writeObjectField("cellClassName", cellClassName);
                if (value.m_modifiers.isPresent()) {
                    final var modifiers = value.m_modifiers.get();
                    final var modifiersData = JsonFormsDataUtil.toJsonData(modifiers);
                    final var modifiersClass = value.m_modifiers.getClass();
                    final var modifiersClassName = modifiersClass.getName();
                    gen.writeObjectField("modifiersClassName", modifiersClassName);
                    gen.writeObjectField("modifiers", modifiersData);
                }
                gen.writeEndObject();

            }
        }

        static class DynamicValueDeserializer extends JsonDeserializer<DynamicValue> {

            @Override
            public DynamicValue deserialize(final JsonParser parser, final DeserializationContext ctx)
                throws IOException {
                final var node = (JsonNode)parser.getCodec().readTree(parser);
                final var modifiersClassName = node.get("modifiersClassName");
                DefaultNodeSettings modifiers = null;
                if (modifiersClassName != null && !modifiersClassName.isMissingNode()) {
                    final var modifiersClass = ModifyersRegistry.modifierClasses.get(modifiersClassName.asText());
                    modifiers = modifiersClass == null ? null
                        : JsonFormsDataUtil.toDefaultNodeSettings(node.get("modifiers"), modifiersClass);
                }

                final var dataType = knownDataTypes.get(node.get("cellClassName").asText());

                DataCell dataCell;
                try {
                    dataCell = DynamicValue.readDataCell(dataType, () -> node.get("value").asDouble(),
                        () -> node.get("value").asText());
                } catch (Exception ex) {
                    throw new IOException("Could not deserialize data cell.", ex);
                }
                return new DynamicValue(dataCell, modifiers);
            }
        }

        static class Persistor implements NodeSettingsPersistor<DynamicValue> {

            @Override
            public DynamicValue load(final NodeSettingsRO settings) throws InvalidSettingsException {
                final var cellClassName = settings.getString("typeIdentifier");
                final var cellClass = DataTypeRegistry.getInstance().getCellClass(cellClassName).orElseThrow();
                final var dataType = DataType.getType(cellClass);

                final var modifiersClass = // TODO
                    ModifyersRegistry.modifierClasses.get(settings.getString("modifiersClassName", ""));
                final var modifiers = modifiersClass == null ? null : DefaultFieldNodeSettingsPersistorFactory
                    .createDefaultPersistor(modifiersClass, "modifiers").load(settings);

                if (settings.containsKey("value")) {
                    try {
                        return new DynamicValue(DynamicValue.readDataCell(dataType, () -> settings.getDouble("value"),
                            () -> settings.getString("value")), modifiers);
                    } catch (InvalidSettingsException e) {
                        throw e;
                    } catch (Exception ex) {
                        throw new InvalidSettingsException("Could not load persisted data cell value", ex);
                    }
                }
                return new DynamicValue(dataType, modifiers);
            }

            @Override
            public void save(final DynamicValue obj, final NodeSettingsWO settings) {
                settings.addString("typeIdentifier", obj.m_type.getCellClass().getName());
                if (obj.m_modifiers.isPresent()) {
                    final var modifiers = obj.m_modifiers.get();
                    settings.addString("modifiersClassName", modifiers.getClass().getName());
                    DefaultFieldNodeSettingsPersistorFactory
                        .createDefaultPersistor((Class<DefaultNodeSettings>)modifiers.getClass(), "modifiers")
                        .save(modifiers, settings);
                }
                if (obj.m_cell.isPresent()) {
                    try {
                        DynamicValue.writeDataCell(obj.m_cell.get(), //
                            d -> settings.addDouble("value", d), //
                            s -> settings.addString("value", s));
                    } catch (Exception ex) {
                        throw new RuntimeException("Could not persist data cell value.", ex); // TODO
                    }
                }
            }

        }
    }

    public Optional<DataCell> getCellAt(final int index) {
        return m_values[index].m_cell;
    }
}
