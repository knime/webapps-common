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
import java.io.StringReader;
import java.io.StringWriter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.apache.commons.lang3.function.FailableConsumer;
import org.apache.commons.lang3.function.FailableSupplier;
import org.knime.core.data.DataCell;
import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataType;
import org.knime.core.data.DataTypeRegistry;
import org.knime.core.data.DataValue;
import org.knime.core.data.convert.datacell.JavaToDataCellConverterFactory;
import org.knime.core.data.convert.datacell.JavaToDataCellConverterRegistry;
import org.knime.core.data.convert.java.DataCellToJavaConverterFactory;
import org.knime.core.data.convert.java.DataCellToJavaConverterRegistry;
import org.knime.core.data.def.BooleanCell;
import org.knime.core.data.def.BooleanCell.BooleanCellFactory;
import org.knime.core.data.def.DoubleCell;
import org.knime.core.data.def.DoubleCell.DoubleCellFactory;
import org.knime.core.data.def.IntCell;
import org.knime.core.data.def.IntCell.IntCellFactory;
import org.knime.core.data.def.LongCell;
import org.knime.core.data.def.LongCell.LongCellFactory;
import org.knime.core.data.def.StringCell;
import org.knime.core.node.ExecutionContext;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.config.base.JSONConfig;
import org.knime.core.node.config.base.JSONConfig.WriterConfig;
import org.knime.core.node.message.Message;
import org.knime.core.node.util.CheckUtils;
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
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * A settings class for a "dynamic widget" where the concrete input widget(s) depend on the selected data type.
 *
 * @author Paul Bärnreuther
 * @author Manuel Hotz, KNIME GmbH, Konstanz, Germany
 */
public class DynamicValuesInput implements PersistableSettings {

    private static final JavaToDataCellConverterRegistry TO_DATACELL = JavaToDataCellConverterRegistry.getInstance();

    private static final DataCellToJavaConverterRegistry FROM_DATACELL = DataCellToJavaConverterRegistry.getInstance();

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
     *
     * @param singleValueType type of the single value
     */
    public DynamicValuesInput(final DataType singleValueType) {
        this(new DynamicValue[]{new DynamicValue(singleValueType)}, InputKind.SINGLE);
    }

    /**
     * Constructor for a single input value, given a data type and cell (of same or subtype) and an initial value. The
     * initial value can be the {@link DataType#getMissingCell()} instance.
     *
     * @param dataType target data type
     * @param initialValue data type and initial value
     */
    public DynamicValuesInput(final DataType dataType, final DataCell initialValue) {
        this(new DynamicValue[]{new DynamicValue(dataType, initialValue)}, InputKind.SINGLE);
    }

    /**
     * Creates an empty input, i.e. an input that does not actually have a concrete input widget. Used for boolean
     * operators {@code IS_TRUE} and {@code IS_FALSE}, that don't need an input value.
     *
     * @return new input
     */
    public static DynamicValuesInput emptySingle() {
        return new DynamicValuesInput(new DynamicValue[]{}, InputKind.SINGLE);
    }

    private enum InputKind {
            SINGLE, DOUBLE, COLLECTION
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof DynamicValuesInput dvi)) {
            return false;
        }
        return m_inputKind == dvi.m_inputKind && Arrays.equals(m_values, dvi.m_values);
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder().append(m_inputKind).append(m_values).toHashCode();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE).append(m_inputKind).append(m_values)
            .toString();
    }

    private static final class ModifiersRegistry {
        private ModifiersRegistry() {
            /* empty default constructor */ }

        private static Map<String, Class<? extends DefaultNodeSettings>> modifierClasses = new HashMap<>();

        static {
            modifierClasses.put(StringValueModifiers.class.getName(), StringValueModifiers.class);
        }
    }

    /**
     * Validates input values.
     *
     * @param colSpec current column spec
     * @throws InvalidSettingsException
     */
    public void validate(final DataColumnSpec colSpec) throws InvalidSettingsException {
        for (final var value : m_values) {
            value.validate(colSpec);
        }
    }

    private static boolean isOfNonCollectionType(final DataType type) {
        return !type.isCollectionType();
    }

    // we need to be able to parse strings from the string input and put cells back to string for settings/json
    private static boolean supportsSerialization(final DataType type) {
        return converterToDataCell(type).isPresent() && converterFromDataCell(type).isPresent();
    }

    /**
     * Check whether types given to this input are supported.
     *
     * @param type type to check
     * @return {@code true} if the given type is supported, {@code false} otherwise
     */
    public static boolean supportsDataType(final DataType type) {
        return isOfNonCollectionType(type) && supportsSerialization(type);
    }

    /**
     * The actual dynamic value.
     *
     * @author Paul Bärnreuther
     * @author Manuel Hotz, KNIME GmbH, Konstanz, Germany
     */
    @Persistor(DynamicValuePersistor.class)
    @JsonSerialize(using = DynamicValueSerializer.class)
    @JsonDeserialize(using = DynamicValueDeserializer.class)
    static class DynamicValue implements PersistableSettings {

        /**
         * Target type.
         */
        private DataType m_type;

        /**
         * Non-{@code null} stored value.
         */
        private DataCell m_value;

        /**
         * Nullable modifiers.
         */
        private DefaultNodeSettings m_modifiers;

        DynamicValue() {
            // For Deserialization
        }

        /**
         * Value without content. Default content will be supplied by dialog.
         *
         * @param columnType type of the content
         */
        private DynamicValue(final DataType columnType) {
            this(columnType, DataType.getMissingCell());
        }

        /**
         * Value with initial content.
         *
         * @param columnType type of the content
         * @param initialValue initial value or {@link DataType#getMissingCell()} if it should be supplied by dialog
         */
        public DynamicValue(final DataType columnType, final DataCell initialValue) {
            this(columnType, initialValue, columnType == StringCell.TYPE ? new StringValueModifiers() : null);
        }

        /**
         * Value without content. Default content will be supplied by dialog.
         *
         * @param columnType type of the content
         * @param modifiers nullable input value modifiers
         */
        private DynamicValue(final DataType columnType, final DefaultNodeSettings modifiers) {
            this(columnType, DataType.getMissingCell(), modifiers);
        }

        /**
         * @param columnType target data type
         * @param initial initial value or {@link DataType#getMissingCell()}
         * @param modifiers optional modifiers
         */
        private DynamicValue(final DataType columnType, final DataCell initial, final DefaultNodeSettings modifiers) {
            m_value = Objects.requireNonNull(initial);
            if (columnType.equals(DataType.getMissingCell().getType())) {
                throw new IllegalArgumentException("DynamicValue must not be of \"MissingCell\" type");
            }
            if (columnType.isCollectionType()) {
                throw new IllegalArgumentException(
                    "Collection types are unsupported: \"%s\"".formatted(columnType.getName()));
            }
            m_type = Objects.requireNonNull(columnType);
            if (!initial.isMissing()) {
                final var cellType = initial.getType();
                CheckUtils.checkArgument(columnType.isASuperTypeOf(cellType) || StringCell.TYPE.equals(cellType),
                    "Cell type \"%s\" is not a subtype of target data type \"%s\" nor a StringCell.", cellType,
                    columnType);
            }
            m_modifiers = modifiers;
        }

        @Override
        public boolean equals(final Object obj) {
            if (obj == this) {
                return true;
            }
            if (obj == null) {
                return false;
            }
            if (!(obj instanceof DynamicValue dv)) {
                return false;
            }
            return m_type.equals(dv.m_type) && m_value.equals(dv.m_value)
                && Objects.equals(m_modifiers, dv.m_modifiers);
        }

        @Override
        public int hashCode() {
            return new HashCodeBuilder(13, 37).append(m_type).append(m_value).append(m_modifiers).toHashCode();
        }

        @Override
        public String toString() {
            return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE).append(m_type).append(m_value)
                .append(m_modifiers).toString();
        }

        /**
         * Validates the input field against the given data column spec, e.g. from a connected input table.
         *
         * @param colSpec spec to validate against
         * @throws InvalidSettingsException if settings are invalid given spec
         */
        private void validate(final DataColumnSpec colSpec) throws InvalidSettingsException {
            CheckUtils.checkSetting(!m_value.isMissing(), "The comparison value is missing.");
            // check if the saved type is still compatible with the current column type
            final var columnType = colSpec.getType();
            if (!m_type.isASuperTypeOf(columnType)) {
                final var colName = colSpec.getName();
                throw Message.builder()
                    .withSummary(
                        "Type of input column \"%s\" is not compatible with comparison value.".formatted(colName))
                    .addTextIssue(
                        "Input column \"%s\" has type \"%s\", but comparison value is of incompatible type \"%s\""
                            .formatted(colName, columnType.getName(), m_type.getName()))
                    .addResolutions("Reconfigure the node to supply a comparison value of type \"%s\"."
                        .formatted(columnType.getName())) //
                    .addResolutions("Change the input column type to \"%s\".".formatted(m_type.getName())) //
                    .build().orElseThrow().toInvalidSettingsException();
            }

            final var cellType = m_value.getType();
            // this condition is `false` iff we packaged a non-convertible input string in a StringCell
            // (in which case m_type will be the column type at point in time when we saved the config)
            if (m_type.equals(cellType)) {
                return;
            }
            // A "real" StringCell (where our column type is also StringCell's type) would have been returned above
            // already... so this must be a StringCell that contains an unconvertible user input.
            // Otherwise, there is something unexpected happening.
            if (!(m_value instanceof StringCell stringCell)) {
                throw new IllegalStateException("Unexpected cell type when retrieving converter error: " + cellType);
            }
            // This is the case if `readDataCellFromStringSafe` failed to type-map when closing the dialog.
            throw retrieveConversionError(m_type, stringCell);
        }

        /**
         * Expects the conversion of the given string cell to the target type to fail, retrieving the conversion
         * exception.
         *
         * @param type target type for conversion
         * @param cell cell to convert to target, expected to fail
         * @return exception with parse error
         */
        private static InvalidSettingsException retrieveConversionError(final DataType type, final StringCell cell) {
            final var stringValue = cell.getStringValue();
            try {
                readDataCellFromString(type, stringValue);
                throw new IllegalStateException(
                    "Expected conversion of string \"%s\" to target type \"%s\" to fail, but it succeeded."
                        .formatted(stringValue, type));
            } catch (final ConverterException e) { // NOSONAR we unwrap our own exception
                return new InvalidSettingsException(e.getMessage(), e.getCause());
            }
        }

        private static <E extends Exception> void writeDataCell(final DataCell dataCell,
            final FailableConsumer<Double, E> writeDouble, //
            final FailableConsumer<Integer, E> writeInteger, //
            final FailableConsumer<Long, E> writeLong, //
            final FailableConsumer<Boolean, E> writeBoolean, //
            final FailableConsumer<String, E> writeString //
        ) throws ConverterException, E {
            if (dataCell.isMissing()) {
                throw new IllegalArgumentException("Cannot write MissingCell");
            }
            if (dataCell instanceof DoubleCell doubleCell) {
                writeDouble.accept(doubleCell.getDoubleValue());
            } else if (dataCell instanceof IntCell intCell) {
                writeInteger.accept(intCell.getIntValue());
            } else if (dataCell instanceof LongCell longCell) {
                writeLong.accept(longCell.getLongValue());
            } else if (dataCell instanceof BooleanCell booleanCell) {
                writeBoolean.accept(booleanCell.getBooleanValue());
            } else {
                writeString.accept(getStringFromDataCell(dataCell));
            }
        }

        private static <E extends Throwable> DataCell readDataCell(final DataType dataType,
            final FailableSupplier<Double, E> readDouble, //
            final FailableSupplier<Integer, E> readInteger, //
            final FailableSupplier<Long, E> readLong, //
            final FailableSupplier<Boolean, E> readBoolean, //
            final FailableSupplier<String, E> readString //
        ) throws E {
            if (dataType.equals(DoubleCell.TYPE)) {
                return DoubleCellFactory.create(readDouble.get());
            } else if (dataType.equals(IntCell.TYPE)) {
                return IntCellFactory.create(readInteger.get());
            } else if (dataType.equals(LongCell.TYPE)) {
                return LongCellFactory.create(readLong.get());
            } else if (dataType.equals(BooleanCell.TYPE)) {
                return BooleanCellFactory.create(readBoolean.get());
            } else {
                return readDataCellFromStringSafe(dataType, readString.get());
            }
        }

        private static String getStringFromDataCell(final DataCell dataCell) throws ConverterException {
            // convertUnsafe does not handle missing cells
            if (dataCell.isMissing()) {
                throw new IllegalArgumentException("Cannot get string from MissingCell");
            }
            // check afterwards, since missing cells are also collection types
            final var dataType = dataCell.getType();
            if (dataType.isCollectionType()) {
                throw new IllegalArgumentException(
                    "Collection types are not supported. Given type is: %s".formatted(dataType));
            }
            final var converter = converterFromDataCell(dataType)
                .orElseThrow(() -> new ConverterException("No serializer for type %s".formatted(dataCell.getType())))
                .create();
            try {
                return converter.convertUnsafe(dataCell);
            } catch (final Exception e) {
                final var msg = e.getMessage();
                throw new ConverterException(msg != null ? msg
                    : "Unable to convert data cell of type \"%s\" to String.".formatted(dataCell.getType()), e);
            }
        }

        /**
         * Converts the given string value to a cell of the given data type. In case the value was {@code null}, a plain
         * missing cell without an error message is returned.
         *
         * The error message is (ab)used to ferry conversion exceptions through the frontend (via the settings).
         *
         * @param dataType target data type
         * @param value string value to deserialize
         * @return data cell for the string representation
         * @throws Exception
         */
        private static DataCell readDataCellFromString(final DataType dataType, final String value)
            throws ConverterException {
            if (value == null) {
                return DataType.getMissingCell();
            }
            if (dataType.isCollectionType()) {
                throw new IllegalArgumentException(
                    "Collection types are not supported. Given type is: %s".formatted(dataType));
            }

            final var converter = converterToDataCell(dataType)
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
    }

    private static final String MODIFIERS_KEY = "modifiers";

    private static final String VALUE_KEY = "value";

    private static final String MODIFIERS_CLASS_NAME_KEY = "modifiersClassName";

    private static final String MISSING_CELL_ERR_KEY = "missingCellError";

    private static final String TYPE_ID_KEY = "typeIdentifier";

    private static final String CELL_CLASS_NAME_KEY = "cellClassName";

    private static final String DATA_TYPE_CONFIG_KEY = "dataTypeConfig";

    private static final String DATA_TYPE_KEY = "dataType";

    private static final String DATA_TYPE_CONFIG_FIELD_NAME = "valueDataType";

    static class DynamicValueSerializer extends JsonSerializer<DynamicValue> {

        @Override
        public void serialize(final DynamicValue value, final JsonGenerator gen,
            final SerializerProvider serializers) throws IOException {

            gen.writeStartObject();
            gen.writeFieldName(VALUE_KEY);
            if (!value.m_value.isMissing()) {
                try {
                    DynamicValue.<IOException> writeDataCell(value.m_value, //
                        gen::writeNumber, //
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

            // non-native types don't have a cell class (and we will use a String input for them anyway)
            final var cellClass = value.m_type.getCellClass();
            final String cellClassName =
                cellClass != null ? cellClass.getName() : StringCell.TYPE.getCellClass().getName();
            // this field determines what input widget the frontend shows
            // (which is why we don't deserialize it below)
            gen.writeStringField(CELL_CLASS_NAME_KEY, cellClassName);

            // serialize the complete datatype so it can round-trip through JSON (currently ignored by frontend)
            final var settings = new NodeSettings(DATA_TYPE_CONFIG_KEY);
            settings.addDataType(DATA_TYPE_KEY, value.m_type);
            final var w = new StringWriter();
            JSONConfig.writeJSON(settings, w, WriterConfig.DEFAULT);
            gen.writeStringField(DATA_TYPE_CONFIG_FIELD_NAME, w.toString());

            if (value.m_modifiers != null) {
                final var modifiers = value.m_modifiers;
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

            final var dataTypeNode = node.get(DATA_TYPE_CONFIG_FIELD_NAME);
            final var config = JSONConfig.readJSON(new NodeSettings(DATA_TYPE_CONFIG_KEY),
                new StringReader(dataTypeNode.asText()));
            DataType dataType;
            try {
                dataType = config.getDataType(DATA_TYPE_KEY);
            } catch (final InvalidSettingsException e) {
                throw new IOException("Could not deserialize data type", e);
            }

            final var valueNode = node.get(VALUE_KEY);
            // handle missing cell already here
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
                valueNode::asDouble, //
                valueNode::asInt, //
                valueNode::asLong, //
                valueNode::asBoolean, //
                valueNode::asText);
            return new DynamicValue(dataType, dataCell, modifiers);
        }
    }

    static class DynamicValuePersistor implements NodeSettingsPersistor<DynamicValue> {

        @Override
        public DynamicValue load(final NodeSettingsRO settings) throws InvalidSettingsException {
            if (settings.containsKey(MISSING_CELL_ERR_KEY)) {
                throw new InvalidSettingsException(settings.getString(MISSING_CELL_ERR_KEY));
            }

            final var modifiersClass = // TODO
                ModifiersRegistry.modifierClasses.get(settings.getString(MODIFIERS_CLASS_NAME_KEY, ""));
            final var modifiers = modifiersClass == null ? null : DefaultFieldNodeSettingsPersistorFactory
                .createDefaultPersistor(modifiersClass, MODIFIERS_KEY).load(settings);

            final var dataType = settings.getDataType(TYPE_ID_KEY);
            if (settings.containsKey(VALUE_KEY)) {
                final var dataCell = DynamicValue.<InvalidSettingsException> readDataCell(dataType, //
                    () -> settings.getDouble(VALUE_KEY), //
                    () -> settings.getInt(VALUE_KEY), //
                    () -> settings.getLong(VALUE_KEY), //
                    () -> settings.getBoolean(VALUE_KEY), //
                    () -> settings.getString(VALUE_KEY) //
                );
                return new DynamicValue(dataType, dataCell, modifiers);
            }
            return new DynamicValue(dataType, modifiers);
        }

        @Override
        public void save(final DynamicValue obj, final NodeSettingsWO settings) {
            settings.addDataType(TYPE_ID_KEY, obj.m_type);
            if (obj.m_modifiers != null) {
                final var modifiers = obj.m_modifiers;
                settings.addString(MODIFIERS_CLASS_NAME_KEY, modifiers.getClass().getName());
                DefaultFieldNodeSettingsPersistorFactory
                    .createDefaultPersistor((Class<DefaultNodeSettings>)modifiers.getClass(), MODIFIERS_KEY)
                    .save(modifiers, settings);
            }
            final var cell = obj.m_value;
            if (!cell.isMissing()) {
                try {
                    // read contents as primitives s.t. flow variables automatically work
                    DynamicValue.writeDataCell(cell, //
                        d -> settings.addDouble(VALUE_KEY, d), //
                        i -> settings.addInt(VALUE_KEY, i), //
                        l -> settings.addLong(VALUE_KEY, l), //
                        b -> settings.addBoolean(VALUE_KEY, b), //
                        s -> settings.addString(VALUE_KEY, s));
                } catch (final ConverterException e) {
                    throw new RuntimeException(
                        String.format("Could not persist data cell value: %s.", e.getMessage()), e);
                }
            } else {
                settings.addString(VALUE_KEY, null);
            }
        }
    }

    /**
     * Exception to indicate serious converter exceptions indicating a value cannot be serialized or deserialized.
     */
    private static final class ConverterException extends Exception {

        private static final long serialVersionUID = 1L;

        ConverterException(final String msg) {
            super(msg);
        }

        ConverterException(final String msg, final Throwable cause) {
            super(msg, cause);
        }
    }

    /**
     * Gets the cell at the specified index, or {@link Optional#empty()} if no value exists at the specified index. If
     * the index does not exist, will throw a runtime exception.
     *
     * @param index index to get value at
     * @return value or empty optional if no value exists at the specified index
     */
    public Optional<DataCell> getCellAt(final int index) {
        return Optional.ofNullable(m_values[index].m_value);
    }

    /**
     * Gets the modifiers for the value at the specified index, or {@link Optional#empty()} if no modifiers exist at the
     * specified index, casting the modifiers to the return type. If the index does not exist, will throw a runtime
     * exception.
     *
     * @param <T> modifiers type
     * @param index index of the modifiers to get
     * @return modifiers or empty optional if no modifiers exist at the specified index.
     */
    @SuppressWarnings("unchecked")
    public <T extends DefaultNodeSettings> Optional<T> getModifiersAt(final int index) {
        return Optional.ofNullable((T)m_values[index].m_modifiers);
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
        return new DynamicValuesInput(new DynamicValue[]{//
            new DynamicValue(StringCell.TYPE), //
            new DynamicValue(DoubleCell.TYPE), //
            new DynamicValue(IntCell.TYPE), //
            new DynamicValue(BooleanCell.TYPE),//
            //new DynamicValue(IntervalCell.TYPE)// currently breaks things, since we have no validation on dialog close
        }, InputKind.SINGLE);
    }

    /**
     * @return a dynamic values input for a single value of RowID.
     */
    public static DynamicValuesInput forRowID() {
        return new DynamicValuesInput(StringCell.TYPE, new StringCell(""));
    }

    /**
     * @return a dynamic values input for a single value of Row Number.
     */
    public static DynamicValuesInput forRowNumber() {
        return new DynamicValuesInput(LongCell.TYPE, new LongCell(1));
    }

    /* == Lookup of type-mappers. == */

    /**
     * Tries to get a converter from String to the given target data type, including support for types that the given
     * target type can adapt to.
     *
     * @param registry converter registry to use
     * @param targetType target type
     * @return deserializing converter
     */
    private static Optional<JavaToDataCellConverterFactory<String>> converterToDataCell(final DataType targetType) {
        final var direct = TO_DATACELL.getConverterFactories(String.class, targetType);
        if (!direct.isEmpty()) {
            return Optional.of(direct.iterator().next());
        }
        // reverse-lookup adapted types and get the converter for one of those, fitting our target type
        // e.g. targetType = SmilesAdapterCell, adapted type will be SmilesCell for which a converter exists
        return getAdaptedTypes(targetType) //
                .flatMap(type -> TO_DATACELL.getConverterFactories(String.class, type).stream()) //
                .findFirst();
    }

    /**
     * Tries to get a converter from the source type to String, including support for types that the given source type
     * can adapt to.
     * @param registry converter registry to use
     * @param srcType source type
     * @return serializing converter
     */
    private static Optional<DataCellToJavaConverterFactory<? extends DataValue, String>> // NOSONAR
            converterFromDataCell(final DataType srcType) {
        final var direct = FROM_DATACELL.getConverterFactories(srcType, String.class);
        if (!direct.isEmpty()) {
            return Optional.of(direct.iterator().next());
        }
        return getAdaptedTypes(srcType) //
                .flatMap(type -> FROM_DATACELL.getConverterFactories(type, String.class).stream()) //
                .findFirst();
    }

    private static Stream<DataType> getAdaptedTypes(final DataType maybeAdapterType) {
        // Why does this method exist?
        // Example: the registry only contains converters to non-adapter cell types, e.g. String->SmilesCell.
        // When passsed a SmilesAdapterCell, the above lookup fails to identify any converters, so we have to look
        // further. Since SmilesCell and SmilesAdapterCell do not implement the exact same value interfaces
        // (there is RWAdapterValue(AdapterValue) included for the adapter one), we need to do a reverse lookup on the
        // adapted types.
        final var dtr = DataTypeRegistry.getInstance();
        final var cellClass = maybeAdapterType.getCellClass();
        // non-native types are not adapter types, which we handle here (they have no CellClass)
        if (cellClass == null) {
            return Stream.empty();
        }
        final var className = cellClass.getName();
        return dtr.availableDataTypes().stream()
            .filter(t -> dtr.getImplementationSubDataTypes(t).anyMatch(className::equals));
    }
}
