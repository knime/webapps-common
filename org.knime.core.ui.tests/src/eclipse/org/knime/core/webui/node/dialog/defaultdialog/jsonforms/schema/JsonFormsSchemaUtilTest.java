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
 *   9 Nov 2021 (Marc Bux, KNIME GmbH, Berlin, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.schema;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.MonthDay;
import java.time.OffsetDateTime;
import java.time.OffsetTime;
import java.time.Period;
import java.time.Year;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.stream.Stream;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.def.DoubleCell;
import org.knime.core.data.def.StringCell;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.SettingsCreationContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.FieldNodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter.ColumnFilter;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.ColumnSelection;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ColumnChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Schema;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Schema.DoubleProvider;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */

@SuppressWarnings("unused")
class JsonFormsSchemaUtilTest {

    private static final ObjectMapper MAPPER = JsonFormsDataUtil.getMapper();

    private static class PropertyNameOverrideTestSetting {
        private static String SNAPSHOT = "{\"test\":{\"type\":\"integer\",\"format\":\"int32\",\"default\":0}}";

        int m_test;
    }

    @Test
    void testPropertyNameOverride() throws JsonProcessingException {
        testSettings(PropertyNameOverrideTestSetting.class);
    }

    private static class TitleTestSetting {
        private static String SNAPSHOT =
            "{\"test\":{\"type\":\"integer\",\"format\":\"int32\",\"title\":\"some title\",\"default\":0}}";

        @Schema(title = "some title")
        int test;
    }

    @Test
    void testTitle() throws JsonProcessingException {
        testSettings(TitleTestSetting.class);
    }

    private static class DescriptionSetting {
        private static String SNAPSHOT =
            "{\"test\":{\"type\":\"integer\",\"format\":\"int32\",\"default\":0,\"description\":\"some description\"}}";

        @Schema(description = "some description")
        int test;
    }

    @Test
    void testDescription() throws JsonProcessingException {
        testSettings(DescriptionSetting.class);
    }

    private static class EnumTestSetting {
        private static String SNAPSHOT = "{\"testEnum\":{\"oneOf\":["//
            + "{\"const\":\"SOME_CHOICE\",\"title\":\"Some choice\"},"//
            + "{\"const\":\"SOME_OTHER_CHOICE\",\"title\":\"second choice\"}"//
            + "]}}";

        enum TestEnum {
                SOME_CHOICE, //
                @Schema(title = "second choice")
                SOME_OTHER_CHOICE
        }

        TestEnum testEnum;
    }

    @Test
    void testEnum() throws JsonProcessingException {
        testSettings(EnumTestSetting.class);
    }

    private static class TestChoices implements ChoicesProvider {
        @Override
        public String[] choices(final SettingsCreationContext context) {
            return new String[]{context.getDataTableSpecs()[0].getColumnSpec(0).getName()};
        }
    }

    private static class TestChoicesSetting {
        private static String SNAPSHOT = "{\"test\":{\"oneOf\":[" + //
            "{\"const\":\"some choice\",\"title\":\"some choice\"}" + //
            "]}}";

        @Schema(choices = TestChoices.class)
        public String test;
    }

    @Test
    void testChoices() throws JsonProcessingException {
        final var spec = new DataTableSpec(new DataColumnSpecCreator("some choice", StringCell.TYPE).createSpec());
        testSettings(TestChoicesSetting.class, spec);
    }

    private static class TestMultipleChoicesSetting {
        private static String SNAPSHOT = "{\"test\":{\"anyOf\":[" + //
            "{\"const\":\"some choice\",\"title\":\"some choice\"}" + //
            "]}}";

        @Schema(choices = TestChoices.class, multiple = true)
        public String[] test;
    }

    @Test
    void testMultipleChoices() throws JsonProcessingException {
        final var spec = new DataTableSpec(new DataColumnSpecCreator("some choice", StringCell.TYPE).createSpec());
        testSettings(TestMultipleChoicesSetting.class, spec);
    }

    private static class MinMaxSetting {
        private static String SNAPSHOT = "{"//
            + "\"testMin\":{\"type\":\"integer\",\"format\":\"int32\",\"default\":0,\"minimum\":0},"//
            + "\"testMax\":{\"type\":\"integer\",\"format\":\"int32\",\"default\":0,\"maximum\":100.0},"//
            + "\"testBoth\":{\"type\":\"integer\",\"format\":\"int32\",\"default\":0,\"minimum\":0,\"maximum\":1000.0},"//
            + "\"testDouble\":{\"type\":\"number\",\"format\":\"double\",\"default\":0.0,\"minimum\":-0.5,\"maximum\":1.5}"//
            + "}";

        @Schema(min = 0)
        public int testMin;

        @Schema(max = 100)
        public int testMax;

        @Schema(min = 0, max = 1000)
        public int testBoth;

        @Schema(min = -0.5, max = 1.5)
        public double testDouble;
    }

    @Test
    void testMinMax() throws JsonProcessingException {
        testSettings(MinMaxSetting.class);
    }

    private static final class MinMaxProviderSetting {

        private static final String SNAPSHOT = "{"//
            + "\"testMin\":{\"type\":\"integer\",\"format\":\"int32\",\"default\":0,\"minimum\":42},"//
            + "\"testMax\":{\"type\":\"integer\",\"format\":\"int32\",\"default\":0,\"maximum\":42},"//
            + "\"testBoth\":{\"type\":\"integer\",\"format\":\"int32\",\"default\":0,\"minimum\":42,\"maximum\":42},"//
            + "\"testDouble\":{\"type\":\"number\",\"format\":\"double\",\"default\":0.0,\"minimum\":42,\"maximum\":42}"//
            + "}";

        @Schema(minProvider = TestProvider.class)
        int testMin;

        @Schema(maxProvider = TestProvider.class)
        int testMax;

        @Schema(min = 0, minProvider = TestProvider.class, max = 1000, maxProvider = TestProvider.class)
        int testBoth;

        @Schema(minProvider = TestProvider.class, maxProvider = TestProvider.class)
        double testDouble;

        private static final class TestProvider implements DoubleProvider {

            @Override
            public double getValue(final SettingsCreationContext context) {
                return 42;
            }

        }
    }

    @Test
    void testMinMaxProviders() throws JsonProcessingException {
        testSettings(MinMaxProviderSetting.class);
    }

    private static class ValidatedStringSetting {
        private static String SNAPSHOT = "{"//
            + "\"testMinLength\":{\"type\":\"string\",\"minLength\":0},"//
            + "\"testMaxLength\":{\"type\":\"string\",\"maxLength\":100},"//
            + "\"testPattern\":{\"type\":\"string\",\"pattern\":\"a.*\"},"//
            + "\"testAll\":{\"type\":\"string\",\"minLength\":0,\"maxLength\":100,\"pattern\":\"a.*\"}"//
            + "}";

        @Schema(minLength = 0)
        public String testMinLength;

        @Schema(maxLength = 100)
        public String testMaxLength;

        @Schema(pattern = "a.*")
        public String testPattern;

        @Schema(minLength = 0, maxLength = 100, pattern = "a.*")
        public String testAll;
    }

    @Test
    void testStringValidationSetting() throws JsonProcessingException {
        testSettings(ValidatedStringSetting.class);
    }

    private static class ContainerSetting {
        private static String SNAPSHOT = "{\"testIntArray\":{"//
            + "\"type\":\"array\","//
            + "\"title\":\"foo\","//
            + "\"items\":{\"type\":\"integer\",\"format\":\"int32\"}"//
            + "}}";

        @Schema(title = "foo")
        public int[] testIntArray;
    }

    @Test
    void testNoAnnotationsInContainerItems() throws JsonProcessingException {
        testSettings(ContainerSetting.class);
    }

    private static class DefaultSetting {
        private static String SNAPSHOT = "{"//
            + "\"testDouble\":{\"type\":\"number\",\"format\":\"double\",\"default\":0.0},"//
            + "\"testFloat\":{\"type\":\"number\",\"format\":\"float\",\"default\":0.0},"//
            + "\"testInt\":{\"type\":\"integer\",\"format\":\"int32\",\"default\":0},"//
            + "\"testLong\":{\"type\":\"integer\",\"format\":\"int64\",\"default\":0},"//
            + "\"testBoolean\":{\"type\":\"boolean\",\"default\":false},"//
            + "\"testNoDefault\":{\"type\":\"string\"},"//
            + "\"testString\":{\"type\":\"string\",\"default\":\"foo\"},"//
            + "\"testArray\":{\"type\":\"array\",\"default\":[{\"testInt\":0}],"//
            + "\"items\":{\"type\":\"object\",\"properties\":"
            + "{\"testInt\":{\"default\":0,\"type\":\"integer\",\"format\":\"int32\"}}}}"//
            + "}";

        public double testDouble;

        public float testFloat;

        public int testInt;

        public long testLong;

        public boolean testBoolean;

        public String testNoDefault;

        public String testString = "foo";

        public IntWithDefault[] testArray = {new IntWithDefault()};
    }

    private static class IntWithDefault {
        public int testInt;
    }

    @Test
    void testDefault() throws JsonProcessingException {
        testSettings(DefaultSetting.class);
    }

    private static class IgnoreSetting {
        private static String SNAPSHOT = "{\"testInt\":{\"type\":\"integer\",\"format\":\"int32\",\"default\":0}}";

        public int testInt;

        public Boolean testBoxedBoolean;

        public Integer testBoxedInteger;

        public Long testBoxedlong;

        public short testShort;

        public Short testBoxedShort;

        public Double testBoxedDouble;

        public Float testBoxedFloat;
    }

    @Test
    void testIgnore() throws JsonProcessingException {
        testSettings(IgnoreSetting.class);
    }

    private static class ColumnChoices implements ColumnChoicesProvider {

        static String[] included = new String[]{"included", "included2"};

        @Override
        public DataColumnSpec[] columnChoices(final SettingsCreationContext context) {
            DataTableSpec spec = context.getDataTableSpecs()[0];
            return Stream.of(included)//
                .map(spec::getColumnSpec)//
                .toArray(DataColumnSpec[]::new);
        }
    }

    private static class NonColumnChoices implements ChoicesProvider {

        static String[] included = new String[]{"included", "included2"};

        @Override
        public String[] choices(final SettingsCreationContext context) {
            return included;
        }
    }

    private static String COMPATIBLE_TYPES_STRING_VALUE = " [" //
        + "\"org.knime.core.data.StringValue\", " //
        + "\"org.knime.core.data.DataValue\", " //
        + "\"org.knime.core.data.NominalValue\"" //
        + "]";

    private static String COMPATIBLE_TYPES_DOUBLE_VALUE = "[" //
        + "\"org.knime.core.data.DoubleValue\", " //
        + "\"org.knime.core.data.DataValue\", " //
        + "\"org.knime.core.data.ComplexNumberValue\", " //
        + "\"org.knime.core.data.FuzzyNumberValue\", " //
        + "\"org.knime.core.data.FuzzyIntervalValue\", " //
        + "\"org.knime.core.data.BoundedValue\"]";

    private static class ColumnSelectionSettings {

        private static DataTableSpec spec =
            new DataTableSpec(new DataColumnSpecCreator(ColumnChoices.included[0], DoubleCell.TYPE).createSpec(),
                new DataColumnSpecCreator(ColumnChoices.included[1], StringCell.TYPE).createSpec(),
                new DataColumnSpecCreator("excluded", StringCell.TYPE).createSpec());

        private static String COMPATIBLE_TYPES_SNAPSHOT = "{\"configKeys\":[\"compatibleTypes_Internals\"]," //
            + "\"items\":{\"configKeys\":[\"compatibleTypes_Internals\"],\"type\":\"string\"}," //
            + "\"type\":\"array\"}";

        private static String SNAPSHOT = "{" + //
            "\"testColumnSelection\":{"// +
            + "\"title\":\"column\","//
            + "\"type\":\"object\","//
            + "\"properties\":{" //
            + "\"selected\":{\"oneOf\":[{\"const\":\"included\",\"title\":\"included\",\"columnType\":\"org.knime.core.data.DoubleValue\",\"columnTypeDisplayed\":\"Number (double)\","
            + "\"compatibleTypes\": " + COMPATIBLE_TYPES_DOUBLE_VALUE //
            + "},{\"const\":\"included2\",\"title\":\"included2\",\"columnType\":\"org.knime.core.data.StringValue\",\"columnTypeDisplayed\":\"String\"," //
            + "\"compatibleTypes\": " + COMPATIBLE_TYPES_STRING_VALUE //
            + "}]},"//
            + "\"compatibleTypes\":" + COMPATIBLE_TYPES_SNAPSHOT + "}}," //
            + "\"testColumnSelectionNoTypes\":{"// +
            + "\"title\":\"strings\","//
            + "\"type\":\"object\","//
            + "\"properties\":{" //
            + "\"selected\":{\"oneOf\":[{\"const\":\"included\",\"title\":\"included\"},{\"const\":\"included2\",\"title\":\"included2\"}]}," //
            + "\"compatibleTypes\":" + COMPATIBLE_TYPES_SNAPSHOT + "}}" + "}";

        @Schema(title = "column", choices = ColumnChoices.class)
        public ColumnSelection testColumnSelection;

        @Schema(title = "strings", choices = NonColumnChoices.class)
        public ColumnSelection testColumnSelectionNoTypes;
    }

    @Test
    void testColumnSelection() throws JsonProcessingException {
        testSettings(ColumnSelectionSettings.class, ColumnSelectionSettings.spec);
    }

    private static String COLUMN_FILTER_SNAPSHOT_IDENTICAL =
        "\"manualFilter\":{\"type\":\"object\",\"properties\":{\"manuallySelected\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"manuallyDeselected\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}}, \"includeUnknownColumns\":{\"type\":\"boolean\",\"default\":false}}, \"default\":{\"manuallySelected\":[], \"manuallyDeselected\":[], \"includeUnknownColumns\":false}},"
            + "\"mode\":{\"oneOf\":[{\"const\":\"MANUAL\",\"title\":\"Manual\"},{\"const\":\"REGEX\",\"title\":\"Regex\"},{\"const\":\"WILDCARD\",\"title\":\"Wildcard\"},{\"const\":\"TYPE\",\"title\":\"Type\"}],\"default\":\"MANUAL\"},"
            + "\"patternFilter\":{\"type\":\"object\",\"properties\":{\"isCaseSensitive\":{\"type\":\"boolean\",\"default\":false},\"isInverted\":{\"type\":\"boolean\",\"default\":false},\"pattern\":{\"type\":\"string\",\"default\":\"\"}},\"default\":{\"pattern\":\"\",\"isCaseSensitive\":false,\"isInverted\":false}},"
            + "\"typeFilter\":{\"type\":\"object\",\"properties\":{"
            + "\"selectedTypes\":{\"default\":[],\"type\":\"array\",\"items\":{\"type\":\"string\"}},"
            + "\"typeDisplays\":{\"default\":[],\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"id\":{\"type\":\"string\"},\"text\":{\"type\":\"string\"}}}}"
            + "},\"default\":{\"selectedTypes\":[],\"typeDisplays\":[]}},";

    private static class ColumnFilterSetting {

        private static DataTableSpec spec =
            new DataTableSpec(new DataColumnSpecCreator(ColumnChoices.included[0], DoubleCell.TYPE).createSpec(),
                new DataColumnSpecCreator(ColumnChoices.included[1], StringCell.TYPE).createSpec(),
                new DataColumnSpecCreator("excluded", StringCell.TYPE).createSpec());

        private static String SNAPSHOT = "{" + //
            "\"testColumnFilter\":{"// +
            + "\"title\":\"columns\","//
            + "\"type\":\"object\","//
            + "\"properties\":{" //
            + COLUMN_FILTER_SNAPSHOT_IDENTICAL + "\"selected\":{\"anyOf\":["
            + "{\"const\":\"included\",\"title\":\"included\",\"columnType\":\"org.knime.core.data.DoubleValue\",\"columnTypeDisplayed\":\"Number (double)\","
            + "\"compatibleTypes\": " + COMPATIBLE_TYPES_DOUBLE_VALUE //
            + "},{\"const\":\"included2\",\"title\":\"included2\",\"columnType\":\"org.knime.core.data.StringValue\",\"columnTypeDisplayed\":\"String\","
            + "\"compatibleTypes\":" + COMPATIBLE_TYPES_STRING_VALUE //
            + "}],\"configKeys\":[\"selected_Internals\"]}"//
            + "}}," //
            + "\"testColumnFilterNoTypes\":{" //
            + "\"title\":\"otherSelection\","//
            + "\"type\":\"object\","//
            + "\"properties\":{" //
            + COLUMN_FILTER_SNAPSHOT_IDENTICAL
            + "\"selected\":{\"anyOf\":[{\"const\":\"included\",\"title\":\"included\"},{\"const\":\"included2\",\"title\":\"included2\"}],\"configKeys\":[\"selected_Internals\"]}"//
            + "}}}";

        @Schema(title = "columns", choices = ColumnChoices.class)
        public ColumnFilter testColumnFilter;

        @Schema(title = "otherSelection", choices = NonColumnChoices.class)
        public ColumnFilter testColumnFilterNoTypes;
    }

    @Test
    void testColumnFilter() throws JsonProcessingException {
        testSettings(ColumnFilterSetting.class, ColumnFilterSetting.spec);
    }

    private static class ColumnFilterSettingWithoutContext {

        private static String SNAPSHOT = "{" + //
            "\"testColumnFilter\":{"// +
            + "\"title\":\"columns\","//
            + "\"type\":\"object\","//
            + "\"properties\":{" //
            + COLUMN_FILTER_SNAPSHOT_IDENTICAL
            + "\"selected\":{\"anyOf\":[{\"const\":\"\",\"title\":\"\",\"columnType\":\"\",\"columnTypeDisplayed\":\"\","
            + "\"compatibleTypes\": []" + "}],\"configKeys\":[\"selected_Internals\"]}"//
            + "}}," //
            + "\"testColumnFilterNoTypes\":{" //
            + "\"title\":\"otherSelection\","//
            + "\"type\":\"object\","//
            + "\"properties\":{" //
            + COLUMN_FILTER_SNAPSHOT_IDENTICAL
            + "\"selected\":{\"anyOf\":[{\"const\":\"\",\"title\":\"\"}],\"configKeys\":[\"selected_Internals\"]}"//
            + "}}" //
            + "}";

        @Schema(title = "columns", choices = ColumnChoices.class)
        public ColumnFilter testColumnFilter;

        @Schema(title = "otherSelection", choices = NonColumnChoices.class)
        public ColumnFilter testColumnFilterNoTypes;
    }

    @Test
    void testColumnFilterWithoutContext() throws JsonProcessingException {
        testSettingsWithoutContext(ColumnFilterSettingWithoutContext.class);
    }

    private static class SettingWithConfigKeyInPersistAnnotation {

        private static String SNAPSHOT = "{\"test\":{" //
            + "\"type\":\"integer\"," //
            + "\"format\":\"int32\"," //
            + "\"title\":\"my_title\"," //
            + "\"default\":0," //
            + "\"configKeys\":[\"my_config_key\"]" //
            + "}}";

        @Persist(configKey = "my_config_key")
        @Schema(title = "my_title")
        public int test;
    }

    @Test
    void testConfigKeyFromPersistAnnotation() throws JsonProcessingException {
        testSettingsWithoutContext(SettingWithConfigKeyInPersistAnnotation.class);
    }

    private static class CustomPersistor implements FieldNodeSettingsPersistor<Integer> {

        @Override
        public Integer load(final NodeSettingsRO settings) throws InvalidSettingsException {
            throw new UnsupportedOperationException("should not be called by this test");
        }

        @Override
        public void save(final Integer obj, final NodeSettingsWO settings) {
            throw new UnsupportedOperationException("should not be called by this test");
        }

        @Override
        public String[] getConfigKeys() {
            return new String[]{"config_key_from_persistor_1", "config_key_from_persistor_2"};
        }
    }

    private static class SettingWithCustomPersistor {

        private static String SNAPSHOT = "{\"test\":{" //
            + "\"type\":\"integer\"," //
            + "\"format\":\"int32\"," //
            + "\"title\":\"my_title\"," //
            + "\"default\":0," //
            + "\"configKeys\":[\"config_key_from_persistor_1\",\"config_key_from_persistor_2\"]" //
            + "}}";

        @Persist(customPersistor = CustomPersistor.class)
        @Schema(title = "my_title")
        public int test;
    }

    @Test
    void testConfigKeyFromCustomPersistor() throws JsonProcessingException {
        testSettingsWithoutContext(SettingWithCustomPersistor.class);
    }

    private record MyStringWrapper(String m_test) {

        @JsonCreator
        MyStringWrapper(final String m_test) {
            this.m_test = m_test;
        }

        @JsonValue
        String toJSON() {
            return m_test;
        }

    }

    private static class SettingWithCustomType {

        private static String SNAPSHOT = "{\"test\":{" //
                + "\"type\":\"object\"," //
                + "\"default\":\"42\"" //
                + "}}";
        @Schema
        public MyStringWrapper m_test = new MyStringWrapper("42");
    }

    /**
     * Tests behavior when providing a custom type via jackson annotations.
     * @throws JsonProcessingException
     */
    @Test
    void testOverrideType() throws JsonProcessingException {
        testSettingsWithoutContext(SettingWithCustomType.class);
    }

    private static class SettingWithJavaTime {

        private static String SNAPSHOT = "{"
            + "\"duration\": {"
            + "    \"default\": 42.0, \"format\": \"int32\", \"type\": \"integer\""
            + "},"
            + "\"year\": {"
            + "    \"default\": \"2006\", \"format\": \"int32\", \"type\": \"integer\""
            + "},"
            + "\"instant\": {"
            + "    \"default\": \"2006-07-28T10:30:00Z\", \"format\": \"date-time\", \"type\": \"string\""
            + "},"
            + "\"localDate\": {"
            + "    \"default\": \"2006-07-28\", \"format\": \"date\", \"type\": \"string\""
            + "},"
            + "\"localDateTime\": {"
            + "    \"default\": \"2006-07-28T10:30:00\", \"format\": \"date-time\", \"type\": \"string\""
            + "},"
            + "\"localTime\": {"
            + "    \"default\": \"10:30:00\", \"format\": \"date-time\", \"type\": \"string\""
            + "},"
            + "\"offsetDateTime\": {"
            + "    \"default\": \"2006-07-28T10:30:00Z\", \"format\": \"date-time\", \"type\": \"string\""
            + "},"
            + "\"offsetTime\": {"
            + "    \"default\": \"10:30Z\", \"format\": \"date-time\", \"type\": \"string\""
            + "},"
            + "\"zonedDateTime\": {"
            + "    \"default\": \"2006-07-28T10:30:00Z\", \"format\": \"date-time\", \"type\": \"string\""
            + "},"
            + "\"yearMonth\": {"
            + "    \"default\": \"2006-07\", \"type\": \"string\""
            + "},"
            + "\"zoneId\": {"
            + "    \"default\": \"Europe/Berlin\", \"type\": \"string\""
            + "},"
            + "\"zoneOffset\": {"
            + "    \"default\": \"+02:00\", \"type\": \"string\""
            + "},"
            + "\"monthDay\": {"
            + "    \"default\": \"--07-28\", \"type\": \"string\""
            + "},"
            + "\"period\": {"
            + "    \"default\": \"P16Y7M1D\", \"type\": \"string\""
            + "}"
            + "}";

        // integer
        Duration m_duration = Duration.ofSeconds(42);
        Year m_year = Year.of(2006);

        // string w/ date/date-time format
        LocalDate m_localDate = LocalDate.of(2006, 7, 28);
        LocalTime m_localTime = LocalTime.of(10, 30);
        LocalDateTime m_localDateTime = LocalDateTime.of(2006, 7, 28, 10, 30);
        Instant m_instant = LocalDateTime.of(2006, 7, 28, 10, 30).toInstant(ZoneOffset.UTC);
        OffsetDateTime m_offsetDateTime = LocalDateTime.of(2006, 7, 28, 10, 30).atOffset(ZoneOffset.UTC);
        ZonedDateTime m_zonedDateTime = LocalDateTime.of(2006, 7, 28, 10, 30).atZone(ZoneOffset.UTC);
        OffsetTime m_offsetTime = OffsetTime.of(LocalTime.of(10, 30), ZoneOffset.UTC);

        // string w/o format
        MonthDay m_monthDay = MonthDay.of(7, 28);
        YearMonth m_yearMonth = YearMonth.of(2006, 7);
        ZoneId m_zoneId = ZoneId.of("Europe/Berlin");
        ZoneOffset m_zoneOffset = ZoneOffset.ofHours(2);
        Period m_period = Period.between(LocalDate.of(2006, 7, 28), LocalDate.of(2023, 3, 1));
    }

    /**
     * Tests serialization of built-in java.time types.
     * @throws JsonProcessingException
     */
    @Test
    void testBuiltInJavaTime() throws JsonProcessingException {
        testSettingsWithoutContext(SettingWithJavaTime.class);
    }

    private static void testSettings(final Class<?> settingsClass, final PortObjectSpec... specs)
            throws JsonMappingException, JsonProcessingException {
        assertJSONAgainstSnapshot(getProperties(settingsClass, specs), settingsClass);
    }

    private static void testSettingsWithoutContext(final Class<?> settingsClass)
            throws JsonMappingException, JsonProcessingException {
        assertJSONAgainstSnapshot(getPropertiesWithoutContext(settingsClass), settingsClass);
    }

    private static void assertJSONAgainstSnapshot(final JsonNode content, final Class<?> settingsClass)
            throws JsonMappingException, JsonProcessingException {
        final var actual = MAPPER.writeValueAsString(content);
        try {
            final var expected = (String)settingsClass.getDeclaredField("SNAPSHOT").get(null);
            final var aTree = MAPPER.readTree(actual);
            final var eTree = MAPPER.readTree(expected);
            assertThatJson(aTree)
                .isEqualTo(eTree);
        } catch (IllegalArgumentException | IllegalAccessException | NoSuchFieldException| SecurityException e) {
            Assertions.fail("Problem accessing the SNAPSHOT of settings class " + settingsClass.getSimpleName()
                + " (most likely a problem of the test implementation itself)");
        }
    }

    private static JsonNode getProperties(final Class<?> clazz, final PortObjectSpec... specs) {
        return JsonFormsSchemaUtil.buildSchema(clazz,  null, DefaultNodeSettings.createSettingsCreationContext(specs), JsonFormsDataUtil.getMapper())
            .get("properties");
    }

    private static JsonNode getPropertiesWithoutContext(final Class<?> clazz) {
        return JsonFormsSchemaUtil.buildIncompleteSchema(clazz, JsonFormsDataUtil.getMapper()).get("properties");
    }

}
