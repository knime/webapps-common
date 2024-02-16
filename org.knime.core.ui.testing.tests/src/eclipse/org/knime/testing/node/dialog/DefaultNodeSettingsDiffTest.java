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
 *   7 Feb 2024 (jasper): created
 */
package org.knime.testing.node.dialog;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.assertj.core.api.Assertions.assertThatNullPointerException;

import java.io.IOException;

import javax.xml.parsers.ParserConfigurationException;

import org.junit.jupiter.api.Test;
import org.xml.sax.SAXException;
import org.xmlunit.builder.DiffBuilder;
import org.xmlunit.diff.Diff;

/**
 * Test the functionality of the {@link DefaultNodeSettingsDiff}. The actual diffing is done in {@link Diff} and
 * adjacent classes, so that is not tested here.
 *
 * @author Jasper Krauter, KNIME GmbH, Konstanz, Germany
 */
class DefaultNodeSettingsDiffTest {

    static final String XML_HEADER =
        """
                <?xml version="1.0" encoding="UTF-8"?>
                <config xmlns="http://www.knime.org/2008/09/XMLConfig" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.knime.org/2008/09/XMLConfig http://www.knime.org/XMLConfig_2008_09.xsd" key="test">
                """;

    static final String XML_FOOTER = "</config>\n";

    static final String EMPTY_XML = XML_HEADER + XML_FOOTER;

    static final String EXAMPLE_XML = XML_HEADER + """
                <entry key="stringV" type="xstring" value="default string"/>
                <entry key="boolV" type="xboolean" value="true"/>
                <config key="nested">
                    <entry key="enumV" type="xstring" value="TOP"/>
                    <entry key="numberV" type="xint" value="42"/>
                </config>
            """ + XML_FOOTER;

    @Test
    void testInstantiation() throws ParserConfigurationException, SAXException, IOException {
        // instantiate with empty diffs
        var diff = DiffBuilder.compare(EMPTY_XML).withTest(EMPTY_XML).build();
        DefaultNodeSettingsDiff.of(diff);
        DefaultNodeSettingsDiff.of(new ExampleDefaultNodeSettings(), new ExampleDefaultNodeSettings());
        DefaultNodeSettingsDiff.of(DefaultNodeSettingsDiff.fromString(EMPTY_XML),
            DefaultNodeSettingsDiff.fromString(EMPTY_XML));

        // instantiate with non-empty diffs
        var diff2 = DiffBuilder.compare(EMPTY_XML).withTest(EXAMPLE_XML).build();
        DefaultNodeSettingsDiff.of(diff2);
        DefaultNodeSettingsDiff.of(new ExampleDefaultNodeSettings(), new NestedExampleDefaultNodeSettings());
        DefaultNodeSettingsDiff.of(DefaultNodeSettingsDiff.fromString(EMPTY_XML),
            DefaultNodeSettingsDiff.fromString(EXAMPLE_XML));
    }

    @Test
    void testDiffs() throws ParserConfigurationException, SAXException, IOException {
        var testSetting1 = new ExampleDefaultNodeSettings();
        var testSetting2 = new ExampleDefaultNodeSettings();
        testSetting1.m_boolV = false;
        testSetting2.m_nested.m_numberV = -42;
        var diff = DefaultNodeSettingsDiff.of(testSetting1, testSetting2);
        assertThat(diff.isEmpty()).as("There should be some differences").isFalse();
        assertThat(diff.summary()).as("wrong values are found").containsPattern("""
                ^Expected attribute value of node setting 'boolV' to be 'false' but was 'true' .* \\(DIFFERENT\\)
                Expected attribute value of node setting 'numberV' to be '42' but was '\\-42' .* \\(DIFFERENT\\)$""");

        var testSetting3 = DefaultNodeSettingsDiff
            .fromString(XML_HEADER + "<entry key=\"stringV\" type=\"xstring\" value=\"default string\"/>" + XML_FOOTER);
        var diff2 = DefaultNodeSettingsDiff.of(testSetting3, DefaultNodeSettingsDiff.fromString(EMPTY_XML));
        assertThat(diff2.isEmpty()).as("Removed Setting is detected").isFalse();

    }

    @Test
    void testDocumentCreation() throws IOException, ParserConfigurationException, SAXException {
        var settings = new ExampleDefaultNodeSettings();
        var xml = DefaultNodeSettingsDiff.toXmlString(settings);
        assertThat(xml).as("Diff class converts Settings to XML properly").isEqualTo(EXAMPLE_XML);
        var fromSettings = DefaultNodeSettingsDiff.fromSettings(settings);
        var fromXML = DefaultNodeSettingsDiff.fromString(xml);
        assertThat(fromXML.isEqualNode(fromSettings)).as("Creation from XML and creation from settings are equivalent")
            .isTrue();
        assertThat(DefaultNodeSettingsDiff.of(settings, settings).isEmpty()).as("Diff on same object should be empty")
            .isTrue();
        assertThat(DefaultNodeSettingsDiff.of(fromSettings, fromXML).isEmpty())
            .as("Diff on equal object should be empty").isTrue();

        assertThatNullPointerException().as("null NodeSettings cannot be converted to XML")
            .isThrownBy(() -> DefaultNodeSettingsDiff.toXmlString(null));
        assertThatExceptionOfType(SAXException.class).as("SAX exception is propagated")
            .isThrownBy(() -> DefaultNodeSettingsDiff.fromString("invalid xml"));
    }

}
