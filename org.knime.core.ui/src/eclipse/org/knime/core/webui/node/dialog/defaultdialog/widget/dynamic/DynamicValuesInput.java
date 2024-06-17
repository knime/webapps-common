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
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.knime.core.data.DataCell;
import org.knime.core.data.DataType;
import org.knime.core.data.DataTypeRegistry;
import org.knime.core.data.MissingCell;
import org.knime.core.data.convert.datacell.JavaToDataCellConverterRegistry;
import org.knime.core.data.convert.java.DataCellToJavaConverterRegistry;
import org.knime.core.data.def.BooleanCell;
import org.knime.core.data.def.BooleanCell.BooleanCellFactory;
import org.knime.core.data.def.DoubleCell;
import org.knime.core.data.def.DoubleCell.DoubleCellFactory;
import org.knime.core.data.def.IntCell;
import org.knime.core.data.def.IntCell.IntCellFactory;
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
import org.knime.core.webui.node.dialog.defaultdialog.widget.Label;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;

/**
 * A settings class for a "dynamic widget" where the concrete input widget(s) depend on the selected data type.
 *
 * @author Paul Bärnreuther
 * @author Manuel Hotz, KNIME GmbH, Konstanz, Germany
 */
public class DynamicValuesInput implements PersistableSettings {

    static Map<String, DataType> knownDataTypes = new ConcurrentHashMap<>();

    DynamicValue[] m_values;

    InputKind m_inputKind;

    /**
     * Needed for schema generation.
     */
    DynamicValuesInput() {
    }

    private DynamicValuesInput(final DynamicValue[] values, final InputKind kind) {
        m_values = values;
        m_inputKind = kind;
    }

    /**
     * Constructor for a single input value, given the data type of the value.
     * @param singleValueType type of the single value
     */
    public DynamicValuesInput(final DataType singleValueType) {
        this(new DynamicValue[]{new DynamicValue(singleValueType)}, InputKind.Single);
    }

    /**
     * Constructor for a single input value, given a data cell that specifies the data type and an initial value.
     * @param singleValue data type and initial value
     */
    public DynamicValuesInput(final DataCell singleValue) {
        this(new DynamicValue[]{new DynamicValue(singleValue, null)}, InputKind.Single);
    }

    /**
     * Creates an empty input, i.e. an input that does not actually have a concrete input widget.
     * Used for boolean operators {@code IS_TRUE} and {@code IS_FALSE}, that don't need an input value.
     *
     * @return new input
     */
    public static DynamicValuesInput emptySingle() {
        return new DynamicValuesInput(new DynamicValue[]{}, InputKind.Single);
    }

    enum InputKind {
            Single, Double, Collection
    }

    static class ModifyersRegistry {
        static Map<String, Class<? extends DefaultNodeSettings>> modifierClasses = new HashMap<>();
    }

    /**
     * The actual dynamic value.
     *
     * @author Paul Bärnreuther
     * @author Manuel Hotz, KNIME GmbH, Konstanz, Germany
     */
    @Persistor(DynamicValue.Persistor.class)
    public static class DynamicValue implements PersistableSettings {

        Optional<DataCell> m_value = Optional.empty();

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
            this(dataCell.getType());
            m_value = Optional.of(dataCell);
            m_modifiers = Optional.ofNullable(modifiers);
        }

        public static final class StringValueModifiers implements DefaultNodeSettings {

            public enum CaseMatching {
                    /** Respect case when matching strings. */
                    @Label("Case sensitive")
                    CASESENSITIVE, //
                    /** Disregard case when matching strings. */
                    @Label("Case insensitive")
                    CASEINSENSITIVE;

                /** Recommended default setting. */
                public static final CaseMatching DEFAULT = CASESENSITIVE;
            }

            CaseMatching m_caseMatching = CaseMatching.DEFAULT;

            public boolean isCaseSensitive() {
                return this.m_caseMatching == CaseMatching.CASESENSITIVE;
            }
        }

        /**
         * Value without content. Default content will be supplied by dialog.
         *
         * @param type type of the content
         */
        public DynamicValue(final DataType type) {
            m_type = type;
            if (type.equals(StringCell.TYPE)) {
                m_modifiers = Optional.of(new StringValueModifiers());
            }
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
            final ConsumerWithException<Double, E> writeDouble, //
            final ConsumerWithException<Integer, E> writeInteger, //
            final ConsumerWithException<Boolean, E> writeBoolean, //
            final ConsumerWithException<String, E> writeString //
        ) throws E, ConverterException {
            if (dataCell instanceof DoubleCell doubleCell) {
                writeDouble.accept(doubleCell.getDoubleValue());
            } else if (dataCell instanceof IntCell intCell) {
                writeInteger.accept(intCell.getIntValue());
            } else if (dataCell instanceof BooleanCell booleanCell) {
                writeBoolean.accept(booleanCell.getBooleanValue());
            } else {
                writeString.accept(getStringFromDataCell(dataCell));
            }

        }

        private static String getStringFromDataCell(final DataCell dataCell) throws ConverterException {
            final var registry = DataCellToJavaConverterRegistry.getInstance();
            final var converter = registry.getConverterFactories(dataCell.getType(), String.class).stream().findFirst()
                .orElseThrow().create();
            try {
                return converter.convertUnsafe(dataCell);
            } catch (Exception e) {
                throw new ConverterException(e);
            }

        }

        private static <E extends Exception> DataCell readDataCell(final DataType dataType,
            final SupplierWithException<Double, E> readDouble, //
            final SupplierWithException<Integer, E> readInteger, //
            final SupplierWithException<Boolean, E> readBoolean, //
            final SupplierWithException<String, E> readString) throws ConverterException, E {
            if (dataType.equals(DoubleCell.TYPE)) {
                return DoubleCellFactory.create(readDouble.get());
            } else if (dataType.equals(IntCell.TYPE)) {
                return IntCellFactory.create(readInteger.get());
            } else if (dataType.equals(BooleanCell.TYPE)) {
                return BooleanCellFactory.create(readBoolean.get());
            } else {
                return readDataCellFromString(dataType, readString.get());
            }

        }

        private static DataCell readDataCellFromString(final DataType dataType, final String value)
            throws ConverterException {
            final var registry = JavaToDataCellConverterRegistry.getInstance();
            final var converter = registry.getConverterFactories(String.class, dataType).stream().findFirst()
                .orElseThrow(/** TODO? This throws e.g. for Collection cells */
                ).create((ExecutionContext)null);
            try {
                return converter.convert(value);
            } catch (Exception e) {
                var missingCellCause =
                    String.format("Unable to convert string \"%s\" to type \"%s\"", value, dataType.getName());
                if (e.getMessage() != null) {
                    missingCellCause += ": " + e.getMessage();
                }
                return new MissingCell(missingCellCause);
            }

        }

        static class DynamicValueSerializer extends JsonSerializer<DynamicValue> {

            @Override
            public void serialize(final DynamicValue value, final JsonGenerator gen,
                final SerializerProvider serializers) throws IOException {

                final var cellClassName = value.m_type.getCellClass().getName();
                knownDataTypes.put(cellClassName, value.m_type);
                gen.writeStartObject();
                gen.writeFieldName("value");
                if (value.m_value.isPresent()) {
                    try {
                        DynamicValue.<IOException> writeDataCell(value.m_value.get(), //
                            gen::writeNumber, //
                            gen::writeNumber, //
                            gen::writeBoolean, //
                            gen::writeString);
                    } catch (ConverterException ex) {
                        throw new IOException("Could not serialize data cell.", ex.get());
                    }
                } else {
                    gen.writeNull();
                }
                gen.writeObjectField("cellClassName", cellClassName);
                if (value.m_modifiers.isPresent()) {
                    final var modifiers = value.m_modifiers.get();
                    final var modifiersData = JsonFormsDataUtil.toJsonData(modifiers);
                    final var modifiersClass = modifiers.getClass();
                    final var modifiersClassName = modifiersClass.getName();
                    ModifyersRegistry.modifierClasses.put(modifiersClassName, modifiersClass);
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
                    final var valueNode = node.get("value");
                    if (valueNode == null || valueNode.isNull()) {
                        return new DynamicValue(dataType);
                    }
                    dataCell = DynamicValue.readDataCell(dataType, //
                        () -> valueNode.asDouble(), //
                        () -> valueNode.asInt(), //
                        () -> valueNode.asBoolean(), //
                        () -> valueNode.asText());
                } catch (ConverterException ex) {
                    throw new IOException("Could not deserialize data cell.", ex.get());
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

                if (settings.containsKey("missingCellError")) {
                    throw new InvalidSettingsException(settings.getString("missingCellError"));
                }
                if (settings.containsKey("value")) {
                    try {
                        return new DynamicValue(DynamicValue.<InvalidSettingsException> readDataCell(dataType, //
                            () -> settings.getDouble("value"), //
                            () -> settings.getInt("value"), //
                            () -> settings.getBoolean("value"), //
                            () -> settings.getString("value")), modifiers);
                    } catch (ConverterException ex) {
                        throw new InvalidSettingsException("Could not load persisted data cell value", ex.get());
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
                if (obj.m_value.isPresent()) {
                    final var cell = obj.m_value.get();
                    /**
                     * the cell being missing means that the type mapping failed to construct a cell from the string
                     * value in the frontend.
                     */
                    if (cell instanceof MissingCell missingCell) {
                        // necessary to be able to still set flow variables in this case
                        settings.addString("value", "");
                        settings.addString("missingCellError", missingCell.getError());
                    } else {
                        try {
                            DynamicValue.writeDataCell(cell, //
                                d -> settings.addDouble("value", d), //
                                i -> settings.addInt("value", i), //
                                b -> settings.addBoolean("value", b), //
                                s -> settings.addString("value", s));
                        } catch (ConverterException ex) {
                            throw new RuntimeException(
                                String.format("Could not persist data cell value: %s.", ex.get().getMessage()),
                                ex.get()); // TODO (RuntimeException ?) Maybe we should save nothing in this case and let the settings validation deal with it
                        }
                    }
                }
            }

        }
    }

    public Optional<DataCell> getCellAt(final int index) {
        return m_values[index].m_value;
    }

    public <T extends DefaultNodeSettings> T getModifiersAt(final int index, final Class<T> clazz) {
        return (T)m_values[index].m_modifiers.orElseThrow();
    }

    static final class ConverterException extends Exception {
        private static final long serialVersionUID = 1L;

        private Exception m_exception;

        ConverterException(final Exception cause) {
            m_exception = cause;
        }

        Exception get() {
            return m_exception;
        }
    }

    /**
     * TODO return true whenever the current state can be obtained by configuring starting with newValue.
     *
     * @param newValue
     * @return
     */
    public boolean isConfigurableFrom(final DynamicValuesInput newValue) {
        if (newValue.m_values.length != m_values.length) {
            return false;
        }
        for (int i = 0; i < newValue.m_values.length; i++) {
            if (!newValue.m_values[i].m_type.equals(m_values[i].m_type)) {
                return false;
            }
        }
        return true;
    }

    // can be used for testing
    static DynamicValuesInput testDummy() {
        return new DynamicValuesInput(
            new DynamicValue[]{//
                new DynamicValue(StringCell.TYPE), //
                new DynamicValue(DoubleCell.TYPE), //
                new DynamicValue(IntCell.TYPE), //
                new DynamicValue(BooleanCell.TYPE),//
            //new DynamicValue(IntervalCell.TYPE)// currently breaks things, since we have no validation on dialog close
            }, InputKind.Single);
    }
}
