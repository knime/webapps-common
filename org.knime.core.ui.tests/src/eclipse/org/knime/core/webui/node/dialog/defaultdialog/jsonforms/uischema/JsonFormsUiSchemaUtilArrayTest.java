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
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_ARRAY_LAYOUT_DETAIL;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtilTest.buildTestUiSchema;

import java.util.Collection;

import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ArrayWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.ChoicesUpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.IdAndText;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.WidgetHandlerException;

/**
 * Test UI schema generation with arrays.
 *
 * @author Benjamin Wilhelm, KNIME GmbH, Berlin, Germany
 * @author Paul Bärnreuther
 */
@SuppressWarnings({"java:S2698", "unused"}) // we accept assertions without messages
class JsonFormsUiSchemaUtilArrayTest {

    @Test
    void testArrayLayout() {
        class TestArrayLayoutSettings implements DefaultNodeSettings {

            @Widget
            ArrayElements[] m_arraySetting;

            @Widget
            Collection<CollectionElements> m_collectionSetting;

            class ArrayElements {

                @Widget
                String m_innerSetting1;

                @Widget
                String m_innerSetting2;
            }

            class CollectionElements {

                @Widget
                String m_innerCollectionSetting1;

                @Widget
                String m_innerCollectionSetting2;
            }
        }

        final var response = buildTestUiSchema(TestArrayLayoutSettings.class);

        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[0].scope").isString()
            .isEqualTo("#/properties/test/properties/arraySetting");
        assertThatJson(response).inPath("$.elements[0].options").isObject().doesNotContainKey("arrayElementTitle");
        assertThatJson(response).inPath("$.elements[0].options").isObject().doesNotContainKey("addButtonText");
        assertThatJson(response).inPath("$.elements[0].options.detail[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[0].options.detail[0].scope").isString()
            .isEqualTo("#/properties/innerSetting1");
        assertThatJson(response).inPath("$.elements[0].options.detail[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[0].options.detail[1].scope").isString()
            .isEqualTo("#/properties/innerSetting2");

        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].scope").isString()
            .isEqualTo("#/properties/test/properties/collectionSetting");
        assertThatJson(response).inPath("$.elements[1].options").isObject().doesNotContainKey("arrayElementTitle");
        assertThatJson(response).inPath("$.elements[1].options").isObject().doesNotContainKey("addButtonText");
        assertThatJson(response).inPath("$.elements[1].options.detail[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].options.detail[0].scope").isString()
            .isEqualTo("#/properties/innerCollectionSetting1");
        assertThatJson(response).inPath("$.elements[1].options.detail[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].options.detail[1].scope").isString()
            .isEqualTo("#/properties/innerCollectionSetting2");
    }

    @Test
    void testArrayWidgetAnnotation() {
        class TestArrayWidgetSettings implements DefaultNodeSettings {

            private static final String EXPECTED_ADD_TEXT = "expected add text";

            private static final String EXPECTED_TITLE = "Expected Title";

            @Widget
            @ArrayWidget(addButtonText = EXPECTED_ADD_TEXT)
            ArrayElements[] m_arraySetting1;

            @Widget
            @ArrayWidget(elementTitle = EXPECTED_TITLE)
            ArrayElements[] m_arraySetting2;

            @Widget
            @ArrayWidget(elementTitle = "", addButtonText = "")
            ArrayElements[] m_arraySetting3;

            @Widget
            @ArrayWidget(addButtonText = EXPECTED_ADD_TEXT)
            Collection<ArrayElements> m_collectionSetting1;

            @Widget
            @ArrayWidget(elementTitle = EXPECTED_TITLE)
            Collection<ArrayElements> m_collectionSetting2;

            @Widget
            @ArrayWidget(elementTitle = "", addButtonText = "")
            Collection<ArrayElements> m_collectionSetting3;

            @Widget(advanced = true)
            ArrayElements[] m_arrayAdvancedSetting;

            class ArrayElements {

                String m_innerSetting1;
            }
        }
        final var response = buildTestUiSchema(TestArrayWidgetSettings.class);

        assertThatJson(response).inPath("$.elements[0].options").isObject().doesNotContainKey("arrayElementTitle");
        assertThatJson(response).inPath("$.elements[0].options.addButtonText").isString()
            .isEqualTo(TestArrayWidgetSettings.EXPECTED_ADD_TEXT);
        assertThatJson(response).inPath("$.elements[1].options.arrayElementTitle").isString()
            .isEqualTo(TestArrayWidgetSettings.EXPECTED_TITLE);
        assertThatJson(response).inPath("$.elements[1].options").isObject().doesNotContainKey("addButtonText");
        assertThatJson(response).inPath("$.elements[2].options").isObject().doesNotContainKey("arrayElementTitle");
        assertThatJson(response).inPath("$.elements[2].options").isObject().doesNotContainKey("addButtonText");

        assertThatJson(response).inPath("$.elements[3].options").isObject().doesNotContainKey("arrayElementTitle");
        assertThatJson(response).inPath("$.elements[3].options.addButtonText").isString()
            .isEqualTo(TestArrayWidgetSettings.EXPECTED_ADD_TEXT);
        assertThatJson(response).inPath("$.elements[4].options.arrayElementTitle").isString()
            .isEqualTo(TestArrayWidgetSettings.EXPECTED_TITLE);
        assertThatJson(response).inPath("$.elements[4].options").isObject().doesNotContainKey("addButtonText");
        assertThatJson(response).inPath("$.elements[5].options").isObject().doesNotContainKey("arrayElementTitle");
        assertThatJson(response).inPath("$.elements[5].options").isObject().doesNotContainKey("addButtonText");
        assertThatJson(response).inPath("$.elements[6].options.isAdvanced").isBoolean().isTrue();
    }

    @Test
    void testDoesNotApplyArrayLayoutOnPrimitiveOrBoxed() {
        enum TestEnum {
                A, B, C;
        }
        class TestPrimitiveOrBoxedArraySettings implements DefaultNodeSettings {

            double[] m_doubleArray;

            Double[] m_boxedDoubleArray;

            int[] m_intArray;

            Integer[] m_boxedIntegerArray;

            boolean[] m_booleanArray;

            Boolean[] m_boxedBooleanArray;

            short[] m_shortArray;

            Short[] m_boxedShortArray;

            long[] m_longArray;

            Long[] m_boxedArray;

            float[] m_floatArray;

            Float[] m_boxedFloatArray;

            char[] m_charArray;

            Character[] m_boxedCharacterArray;

            TestEnum[] m_enumArray;

            Collection<String> m_stringCollection;
        }

        final var response = buildTestUiSchema(TestPrimitiveOrBoxedArraySettings.class);

        for (var item : response.get("elements")) {
            assertThatJson(item).isObject().doesNotContainKey("options");
        }
    }

    @Test
    void testDoesNotApplyArrayLayoutOnStringArrays() {

        class TestStringArraySettings implements DefaultNodeSettings {

            @Widget
            String[] m_stringArray;
        }

        final var response = buildTestUiSchema(TestStringArraySettings.class);
        assertThatJson(response).inPath("elements[0].options").isObject().doesNotContainKey(TAG_ARRAY_LAYOUT_DETAIL);
    }

    @Test
    void testResolvesDependenciesFromOutsideTheArrayLayout() {

        class TestArrayLayoutWithUpdateSettings implements DefaultNodeSettings {

            @Widget
            String m_dependency;

            static class Dependency {
                String m_dependency;
            }

            static class DependencyHandler implements ChoicesUpdateHandler<Dependency> {

                @Override
                public IdAndText[] update(final Dependency settings, final DefaultNodeSettingsContext context)
                    throws WidgetHandlerException {
                    throw new IllegalStateException("Should not be called within this test");
                }

            }

            @Widget
            ArrayElements[] m_arraySetting;

            class ArrayElements {

                @Widget
                @ChoicesWidget(choicesUpdateHandler = DependencyHandler.class)
                String m_innerSetting;
            }
        }

        final var response = buildTestUiSchema(TestArrayLayoutWithUpdateSettings.class);

        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].scope").isString()
            .isEqualTo("#/properties/test/properties/arraySetting");
        assertThatJson(response).inPath("$.elements[1].options.detail[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].options.detail[0].scope").isString()
            .isEqualTo("#/properties/innerSetting");
        assertThatJson(response).inPath("$.elements[1].options.detail[0].options.choicesUpdateHandler").isString()
            .isEqualTo("org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtilArrayTest$1TestArrayLayoutWithUpdateSettings$DependencyHandler");
        assertThatJson(response).inPath("$.elements[1].options.detail[0].options.dependencies[0]").isString()
        .isEqualTo("#/properties/test/properties/dependency");
    }
}