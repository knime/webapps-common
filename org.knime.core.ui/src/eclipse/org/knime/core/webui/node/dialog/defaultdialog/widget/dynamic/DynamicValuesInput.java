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
import java.util.function.Function;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.function.FailableConsumer;
import org.apache.commons.lang3.function.FailableSupplier;
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
import org.knime.core.node.NodeLogger;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.util.CheckUtils;
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

    private static final NodeLogger LOGGER = NodeLogger.getLogger(DynamicValuesInput.class);

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
     * Constructor for a single input value, given a data type and cell (of same or subtype) and an initial value.
     * The initial value can be the {@link DataType#getMissingCell()} instance.
     *
     * @param dataType target data type
     * @param initialValue data type and initial value
     */
    public DynamicValuesInput(final DataType dataType, final DataCell initialValue) {
        this(new DynamicValue[]{new DynamicValue(dataType, initialValue, null)}, InputKind.Single);
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

    static class ModifiersRegistry {
        static Map<String, Class<? extends DefaultNodeSettings>> modifierClasses = new HashMap<>();
    }


    public void validate() throws InvalidSettingsException {
        for (final var value : m_values) {
            value.validate();
        }
    }

    /**
     * The actual dynamic value.
     *
     * @author Paul Bärnreuther
     * @author Manuel Hotz, KNIME GmbH, Konstanz, Germany
     */
    @Persistor(DynamicValue.Persistor.class)
    public static class DynamicValue implements PersistableSettings {

        private static final String MODIFIERS_KEY = "modifiers";
        private static final String VALUE_KEY = "value";
        private static final String MODIFIERS_CLASS_NAME_KEY = "modifiersClassName";
        private static final String MISSING_CELL_ERR_KEY = "missingCellError";
        private static final String TYPE_ID_KEY = "typeIdentifier";
        private static final String CELL_CLASS_NAME_KEY = "cellClassName";

        /**
         * Stored value. If present, either already of the target type or a StringCell.
         */
        Optional<DataCell> m_value = Optional.empty();

        /**
         * Target type.
         */
        DataType m_type;

        Optional<DefaultNodeSettings> m_modifiers = Optional.empty();

        DynamicValue() {
            // For Deserialization
        }

        /**
         * Value with content. Can be used to supply initial value.
         * @param dataType target type
         * @param dataCell cell specifying the content (and compatible type)
         */
        private DynamicValue(final DataType dataType, final DataCell dataCell, final DefaultNodeSettings modifiers) {
            this(dataType);
            final var cellType = dataCell.getType();
            CheckUtils.checkArgument(dataType.isASuperTypeOf(cellType) || StringCell.TYPE.equals(cellType),
                "Cell type \"%s\" is not a subtype of target data type \"%s\" nor a StringCell.", cellType, dataType);
            m_value = Optional.of(dataCell);
            m_modifiers = Optional.ofNullable(modifiers);
        }

        public static final class StringValueModifiers implements DefaultNodeSettings {

            static {
                ModifiersRegistry.modifierClasses.put(StringValueModifiers.class.getName(), StringValueModifiers.class);
            }

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
            if (type.equals(DataType.getMissingCell().getType())) {
                throw new IllegalArgumentException("DynamicValue must be of non-MissingCell type");
            }
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
            if (type.equals(DataType.getMissingCell().getType())) {
                throw new IllegalArgumentException("DynamicValue must be of non-MissingCell type");
            }
            m_type = type;
            m_modifiers = Optional.ofNullable(modifiers);
        }

        Optional<DataCell> getCell() throws InvalidSettingsException {
            if (m_value.isEmpty()) {
                return Optional.empty();
            }
            final var inputCell = m_value.get();
            final var cellType = inputCell.getType();
            if (cellType.equals(m_type)) {
                return Optional.of(inputCell);
            }
            if (inputCell instanceof StringCell stringCell) {
                // input must still be converted (also to retrieve any parse errors)
                final var stringValue = stringCell.getStringValue();
                try {
                    return Optional.of(readDataCellFromString(m_type, stringValue));
                } catch (final Exception e) {
                    var message = e.getMessage();
                    if (message == null) {
                        message = "Unable to convert \"%s\" to cell of type \"%s\"".formatted(stringValue, m_type);
                    }
                    throw new InvalidSettingsException(message, e.getCause());
                }
            }
            throw new IllegalStateException(
                "Input cell must already be of target data type or a StringCell, but was \"%s\""
                    .formatted(cellType));
        }

        public void validate() throws InvalidSettingsException {
            CheckUtils.checkSetting(getCell().isPresent(), "The comparison value is missing.");
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

        private static <X extends Throwable> DataType getDataTypeForCellClassName(final String cellClassName,
            final Function<String, X> exception) throws X {
            final var cellClass = DataTypeRegistry.getInstance().getCellClass(cellClassName).orElseThrow(
                () -> exception.apply("No cell implementation found for \"%s\"".formatted(cellClassName)));
            return DataType.getType(cellClass);
        }

        private static <E extends Exception> void writeDataCell(final DataCell dataCell,
            final FailableConsumer<Double, E> writeDouble, //
            final FailableConsumer<Integer, E> writeInteger, //
            final FailableConsumer<Boolean, E> writeBoolean, //
            final FailableConsumer<String, E> writeString //
        ) throws ConverterException, E {
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

        private static <E extends Throwable> DataCell readDataCell(final DataType dataType,
            final FailableSupplier<Double, E> readDouble, //
            final FailableSupplier<Integer, E> readInteger, //
            final FailableSupplier<Boolean, E> readBoolean, //
            final FailableSupplier<String, E> readString //
        ) throws E {
            if (dataType.equals(DoubleCell.TYPE)) {
                return DoubleCellFactory.create(readDouble.get());
            } else if (dataType.equals(IntCell.TYPE)) {
                return IntCellFactory.create(readInteger.get());
            } else if (dataType.equals(BooleanCell.TYPE)) {
                return BooleanCellFactory.create(readBoolean.get());
            } else {
                return readDataCellFromStringSafe(dataType, readString.get());
            }
        }

        private static String getStringFromDataCell(final DataCell dataCell) throws ConverterException {
            final var dataType = dataCell.getType();
            // convertUnsafe does not handle missing cells
            if (dataCell instanceof MissingCell) {
                return null;
            }
            // check afterwards, since missing cells are also collection types
            if (dataType.isCollectionType()) {
                throw new IllegalArgumentException("Collection types are not supported. Given type is: %s"
                    .formatted(dataType));
            }
            final var registry = DataCellToJavaConverterRegistry.getInstance();
            final var converter = registry.getConverterFactories(dataCell.getType(), String.class).stream().findFirst()
                .orElseThrow(() -> new ConverterException("No serializer for type %s".formatted(dataCell.getType())))
                .create();
            try {
                return converter.convertUnsafe(dataCell);
            } catch (final Exception e) {
                final var msg = e.getMessage();
                throw new ConverterException(
                    msg != null ? msg
                        : "Unable to convert data cell of type \"%s\" to String.".formatted(dataCell.getType()),
                    e.getCause());
            }
        }

        /**
         * Converts the given string value to a cell of the given data type. In case the value was {@code null},
         * a plain missing cell without an error message is returned.
         *
         * The error message is (ab)used to ferry conversion exceptions through the frontend (via the settings).
         *
         * @param dataType target data type
         * @param value string value to deserialize
         * @return data cell for the string representation
         * @throws Exception
         */
        // TODO update javadoc
        private static DataCell readDataCellFromString(final DataType dataType, final String value)
                throws ConverterException {
            if (dataType.isCollectionType()) {
                throw new IllegalArgumentException("Collection types are not supported. Given type is: %s"
                    .formatted(dataType));
            }

            final var registry = JavaToDataCellConverterRegistry.getInstance();
            final var converter = registry.getConverterFactories(String.class, dataType).stream().findFirst()
                .orElseThrow(() -> new ConverterException("No deserializer for type %s".formatted(dataType)))
                .create((ExecutionContext)null);
            try {
                return converter.convert(value);
            } catch (final Exception e) {
                final var isEmpty = StringUtils.isEmpty(value);
                final var content = isEmpty ? "empty input" : "input \"%s\"".formatted(value);
                var message = "Could not convert %s to \"%s\"".formatted(content, dataType);
                final var cause = e.getCause();
                final var causeMsg = cause != null ? cause.getMessage() : null;
                if (causeMsg != null && !isEmpty) {
                    message += ": " + causeMsg;
                }
                throw new ConverterException(message, cause);
            }
        }

        private static DataCell readDataCellFromStringSafe(final DataType dataType, final String value) {
            try {
                return readDataCellFromString(dataType, value);
            } catch (final ConverterException e) {
                return new StringCell(value);
            }
        }

        static class DynamicValueSerializer extends JsonSerializer<DynamicValue> {

            @Override
            public void serialize(final DynamicValue value, final JsonGenerator gen,
                final SerializerProvider serializers) throws IOException {

                gen.writeStartObject();
                gen.writeFieldName(VALUE_KEY);
                if (value.m_value.isPresent()) {
                    try {
                        DynamicValue.<IOException> writeDataCell(value.m_value.get(), //
                            gen::writeNumber, //
                            gen::writeNumber, //
                            gen::writeBoolean, //
                            gen::writeString);
                    } catch (final ConverterException e) {
                        throw new IOException(e);
                    }
                } else {
                    gen.writeNull();
                }
                final var cellClassName = value.m_type.getCellClass().getName();
                gen.writeObjectField(CELL_CLASS_NAME_KEY, cellClassName);
                if (value.m_modifiers.isPresent()) {
                    final var modifiers = value.m_modifiers.get();
                    final var modifiersData = JsonFormsDataUtil.toJsonData(modifiers);
                    final var modifiersClass = modifiers.getClass();
                    final var modifiersClassName = modifiersClass.getName();
                    gen.writeObjectField(MODIFIERS_CLASS_NAME_KEY, modifiersClassName);
                    gen.writeObjectField(MODIFIERS_KEY, modifiersData);
                }
                gen.writeEndObject();

            }
        }

        static class DynamicValueDeserializer extends JsonDeserializer<DynamicValue> {

            @Override
            public DynamicValue deserialize(final JsonParser parser, final DeserializationContext ctx)
                throws IOException {
                final var node = (JsonNode)parser.getCodec().readTree(parser);

                final var cellClassName = node.get(CELL_CLASS_NAME_KEY).asText();
                final var dataType = getDataTypeForCellClassName(cellClassName, IOException::new);

                final var valueNode = node.get(VALUE_KEY);
                if (valueNode == null || valueNode.isNull()) {
                    return new DynamicValue(dataType);
                }

                final var modifiersClassName = node.get(MODIFIERS_CLASS_NAME_KEY);
                DefaultNodeSettings modifiers = null;
                if (modifiersClassName != null && !modifiersClassName.isMissingNode()) {
                    final var modifiersClass = ModifiersRegistry.modifierClasses.get(modifiersClassName.asText());
                    modifiers = modifiersClass == null ? null
                        : JsonFormsDataUtil.toDefaultNodeSettings(node.get(MODIFIERS_KEY), modifiersClass);
                }
                final var dataCell = DynamicValue.readDataCell(dataType, //
                    () -> valueNode.asDouble(), //
                    () -> valueNode.asInt(), //
                    () -> valueNode.asBoolean(), //
                    () -> valueNode.asText());
                return new DynamicValue(dataType, dataCell, modifiers);
            }
        }

        static class Persistor implements NodeSettingsPersistor<DynamicValue> {

            @Override
            public DynamicValue load(final NodeSettingsRO settings) throws InvalidSettingsException {
                final var cellClassName = settings.getString(TYPE_ID_KEY);
                final var dataType = getDataTypeForCellClassName(cellClassName, InvalidSettingsException::new);

                final var modifiersClass = // TODO
                    ModifiersRegistry.modifierClasses.get(settings.getString(MODIFIERS_CLASS_NAME_KEY, ""));
                final var modifiers = modifiersClass == null ? null : DefaultFieldNodeSettingsPersistorFactory
                    .createDefaultPersistor(modifiersClass, MODIFIERS_KEY).load(settings);

                if (settings.containsKey(MISSING_CELL_ERR_KEY)) {
                    throw new InvalidSettingsException(settings.getString(MISSING_CELL_ERR_KEY));
                }
                if (settings.containsKey(VALUE_KEY)) {
                    final var dataCell = DynamicValue.<InvalidSettingsException> readDataCell(dataType, //
                        () -> settings.getDouble(VALUE_KEY), //
                        () -> settings.getInt(VALUE_KEY), //
                        () -> settings.getBoolean(VALUE_KEY), //
                        () -> settings.getString(VALUE_KEY));
                    return new DynamicValue(dataType, dataCell, modifiers);
                }
                return new DynamicValue(dataType, modifiers);
            }

            @Override
            public void save(final DynamicValue obj, final NodeSettingsWO settings) {
                settings.addString(TYPE_ID_KEY, obj.m_type.getCellClass().getName());
                if (obj.m_modifiers.isPresent()) {
                    final var modifiers = obj.m_modifiers.get();
                    settings.addString(MODIFIERS_CLASS_NAME_KEY, modifiers.getClass().getName());
                    DefaultFieldNodeSettingsPersistorFactory
                        .createDefaultPersistor((Class<DefaultNodeSettings>)modifiers.getClass(), MODIFIERS_KEY)
                        .save(modifiers, settings);
                }
                if (obj.m_value.isPresent()) {
                    final var cell = obj.m_value.get();
                    try {
                        DynamicValue.writeDataCell(cell, //
                            d -> settings.addDouble(VALUE_KEY, d), //
                            i -> settings.addInt(VALUE_KEY, i), //
                            b -> settings.addBoolean(VALUE_KEY, b), //
                            s -> settings.addString(VALUE_KEY, s));
                    } catch (final ConverterException e) {
                        throw new RuntimeException(
                            String.format("Could not persist data cell value: %s.", e.getMessage()), e.getCause());
                    }
                }
            }

        }
    }

    /**
     * Exception to indicate serious converter exceptions indicating a value cannot be serialized or deserialized.
     */
    static final class ConverterException extends Exception {

        ConverterException(final String msg) {
            super(msg);
        }

        ConverterException(final String msg, final Throwable cause) {
            super(msg, cause);
        }
    }

    public Optional<DataCell> getCellAt(final int index) {
        return m_values[index].m_value;
    }

    public <T extends DefaultNodeSettings> T getModifiersAt(final int index, final Class<T> clazz) {
        return (T)m_values[index].m_modifiers.orElseThrow();
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
