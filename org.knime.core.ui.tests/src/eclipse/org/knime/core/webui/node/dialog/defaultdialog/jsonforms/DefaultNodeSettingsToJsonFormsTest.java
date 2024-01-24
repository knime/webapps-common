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
 *   Jan 9, 2024 (hornm): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

/**
 * Tests various aspects of the {@link DefaultNodeSettings} to json-forms (data, json-schema, ui-schema) generation.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
class DefaultNodeSettingsToJsonFormsTest {

    private static class TestSettings implements DefaultNodeSettings {

        @Widget(title = "title", description = "desc")
        String field = "field";

        @Widget
        String m_fieldWithPrefix = "setting with m_-prefix";

        @Widget
        private String privateField = "private field";

        @Widget
        String fieldWithNullValue = null;

        String fieldWithoutAnnotation = "field without annotation";

        NestedSettings nestedSettings = new NestedSettings();

        public String getValue() {
            return "test";
        }

        public boolean isTrue() {
            return true;
        }

    }

    static class NestedSettings implements WidgetGroup {

        @Widget
        String nestedField = "nested field";

        String nestedFieldWithoutAnnotation = "nested field without annotation";

    }

    /**
     * Tests the general conversion of {@link DefaultNodeSettings} to the jsonforms-format (consisting of the
     * json-serialized data-object, the json-schema for the data-object and the ui-schema). It, e.g., makes sure that
     * <ul>
     * <li>getters and is-getters ignored</li>
     * <li>fields without a {@link Widget}-annotation are ignored in the ui-schema
     * <li>fields with an 'm_'-prefix</li>
     * <li>private field with Widget-annotation</li>
     * <li>nested {@link WidgetGroup}</li>
     * <li>fields with null-value</li>
     * </ul>
     *
     * @throws JsonProcessingException
     * @throws JsonMappingException
     */
    @Test
    void testDefaultNodeSettingsToJsonFormsConversion() throws JsonMappingException, JsonProcessingException {
        var jsonForms = new JsonFormsSettingsImpl(Map.of(SettingsType.MODEL, new TestSettings()), null);
        var mapper = JsonFormsDataUtil.getMapper();

        var data = jsonForms.getData();
        assertThatJson(data).isEqualTo("""
                {
                  "model" : {
                    "field" : "field",
                    "fieldWithPrefix" : "setting with m_-prefix",
                    "fieldWithoutAnnotation" : "field without annotation",
                    "nestedSettings" : {
                        "nestedField" : "nested field",
                        "nestedFieldWithoutAnnotation" : "nested field without annotation"
                    }
                  }
                }
                 """);

        var schema = jsonForms.getSchema();
        schema = mapper.readTree(mapper.writeValueAsString(schema));
        assertThatJson(schema).isEqualTo("""
                {
                  "type" : "object",
                  "properties" : {
                    "model" : {
                      "type" : "object",
                      "properties" : {
                        "field" : {
                          "type" : "string",
                          "title" : "title",
                          "description" : "desc",
                          "default" : "field"
                        },
                        "fieldWithPrefix" : {
                          "type" : "string",
                          "default" : "setting with m_-prefix"
                        },
                        "fieldWithNullValue" : {
                            "type" : "string"
                        },
                        "fieldWithoutAnnotation" : {
                          "type" : "string",
                          "default" : "field without annotation"
                        },
                        "nestedSettings" : {
                          "type" : "object",
                          "properties" : {
                            "nestedField" : {
                              "type" : "string",
                              "default" : "nested field"
                            },
                            "nestedFieldWithoutAnnotation" : {
                              "type" : "string",
                              "default" : "nested field without annotation"
                            }
                          },
                          "default" : {
                            "nestedField" : "nested field",
                            "nestedFieldWithoutAnnotation" : "nested field without annotation"
                          }
                        }
                      }
                    }
                  }
                }
                """);

        var uiSchema = jsonForms.getUiSchema(null);
        var uiSchemaJson = mapper.readTree(uiSchema.rawValue().toString());
        assertThatJson(uiSchemaJson).isEqualTo("""
                {
                    "elements": [
                        {
                            "type": "Control",
                            "scope": "#/properties/model/properties/field"
                        },
                        {
                            "type": "Control",
                            "scope": "#/properties/model/properties/fieldWithPrefix"
                        },
                        {
                            "type": "Control",
                            "scope": "#/properties/model/properties/fieldWithNullValue"
                        },
                        {
                            "type": "Control",
                            "scope": "#/properties/model/properties/nestedSettings/properties/nestedField"
                        }
                    ]
                }
                """);
    }

}