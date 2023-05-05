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
 *   Mar 21, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtilTest.buildTestUiSchema;

import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.layout.HorizontalLayout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.rule.And;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect.EffectType;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Expression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.FalseCondition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Not;
import org.knime.core.webui.node.dialog.defaultdialog.rule.OneOfEnumCondition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Or;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Signal;
import org.knime.core.webui.node.dialog.defaultdialog.rule.TrueCondition;

/**
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class JsonFormsUiSchemaUtilRuleTest {

    @Test
    void testSimpleRule() {

        final class SimpleRuleSettings implements DefaultNodeSettings {

            interface SomeBooleanIsTrue {
            }

            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Effect(signals = SomeBooleanIsTrue.class, type = EffectType.DISABLE)
            boolean m_tagetSetting;

        }

        final var response = buildTestUiSchema(SimpleRuleSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("DISABLE");
        assertThatJson(response).inPath("$.elements[1].rule.condition.scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.const").isBoolean().isTrue();
    }

    @Test
    void testIdentifyByCondition() {

        final class IdentifyByRuleTest implements DefaultNodeSettings {

            enum OneTwoOrThree {
                    ONE, TWO, THREE
            }

            static class OneOrTwo extends OneOfEnumCondition<OneTwoOrThree> {

                @Override
                public OneTwoOrThree[] oneOf() {
                    return new OneTwoOrThree[]{OneTwoOrThree.ONE, OneTwoOrThree.TWO};
                }

            }

            @Signal(condition = OneOrTwo.class)
            OneTwoOrThree m_someBoolean;

            @Effect(signals = OneOrTwo.class, type = EffectType.DISABLE)
            boolean m_tagetSetting;

        }

        final var response = buildTestUiSchema(IdentifyByRuleTest.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("DISABLE");
        assertThatJson(response).inPath("$.elements[1].rule.condition.scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.oneOf").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.oneOf[0].const").isString()
            .isEqualTo("ONE");
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.oneOf[1].const").isString()
            .isEqualTo("TWO");
    }

    @Test
    void testEffect() {

        final class EffectSettings implements DefaultNodeSettings {

            interface SomeBooleanIsTrue {
            }

            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Effect(signals = SomeBooleanIsTrue.class, type = EffectType.DISABLE)
            boolean m_disable;

            @Effect(signals = SomeBooleanIsTrue.class, type = EffectType.ENABLE)
            boolean m_enable;

            @Effect(signals = SomeBooleanIsTrue.class, type = EffectType.HIDE)
            boolean m_hide;

            @Effect(signals = SomeBooleanIsTrue.class, type = EffectType.SHOW)
            boolean m_show;

        }

        final var response = buildTestUiSchema(EffectSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(5);
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("DISABLE");
        assertThatJson(response).inPath("$.elements[2].rule.effect").isString().isEqualTo("ENABLE");
        assertThatJson(response).inPath("$.elements[3].rule.effect").isString().isEqualTo("HIDE");
        assertThatJson(response).inPath("$.elements[4].rule.effect").isString().isEqualTo("SHOW");
    }

    @Test
    void testAnd() {
        final class AndSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            interface AnotherBooleanIsFalse {
            }

            @Signal(id = AnotherBooleanIsFalse.class, condition = FalseCondition.class)
            boolean m_anotherBoolean;

            @Effect(signals = {SomeBooleanIsTrue.class, AnotherBooleanIsFalse.class}, type = EffectType.ENABLE,
                operation = And.class)
            boolean m_effect;
        }
        final var response = buildTestUiSchema(AndSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");

        assertThatJson(response).inPath("$.elements[2].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[2].rule.effect").isString().isEqualTo("ENABLE");
        assertThatJson(response).inPath("$.elements[2].rule.condition.type").isString().isEqualTo("AND");
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[0].scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[0].schema.const").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[1].scope").isString()
            .isEqualTo(response.get("elements").get(1).get("scope").asText());
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[1].schema.const").isBoolean()
            .isFalse();
    }

    @Test
    void testOr() {
        final class OrSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            interface AnotherBooleanIsFalse {
            }

            @Signal(id = AnotherBooleanIsFalse.class, condition = FalseCondition.class)
            boolean m_anotherBoolean;

            @Effect(signals = {SomeBooleanIsTrue.class, AnotherBooleanIsFalse.class}, type = EffectType.ENABLE,
                operation = Or.class)
            boolean m_effect;
        }
        final var response = buildTestUiSchema(OrSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");

        assertThatJson(response).inPath("$.elements[2].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[2].rule.effect").isString().isEqualTo("ENABLE");
        assertThatJson(response).inPath("$.elements[2].rule.condition.type").isString().isEqualTo("OR");
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[0].scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[0].schema.const").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[1].scope").isString()
            .isEqualTo(response.get("elements").get(1).get("scope").asText());
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[1].schema.const").isBoolean()
            .isFalse();
    }

    @Test
    void testNot() {

        final class NotSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Effect(signals = SomeBooleanIsTrue.class, type = EffectType.ENABLE, operation = Not.class)
            boolean m_effect;
        }
        final var response = buildTestUiSchema(NotSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("ENABLE");
        assertThatJson(response).inPath("$.elements[1].rule.condition.scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.not.const").isBoolean().isTrue();
    }

    static final class NotAnd extends Not {

        public NotAnd(final Expression first, final Expression second) {
            super(new And(first, second));
        }

    }

    @Test
    void testNotAnd() {

        final class NotAndSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            interface AnotherBooleanIsFalse {
            }

            @Signal(id = AnotherBooleanIsFalse.class, condition = FalseCondition.class)
            boolean m_anotherBoolean;

            @Effect(signals = {SomeBooleanIsTrue.class, AnotherBooleanIsFalse.class}, type = EffectType.ENABLE,
                operation = NotAnd.class)
            boolean m_effect;
        }
        final var response = buildTestUiSchema(NotAndSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");

        assertThatJson(response).inPath("$.elements[2].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[2].rule.effect").isString().isEqualTo("ENABLE");
        assertThatJson(response).inPath("$.elements[2].rule.condition.type").isString().isEqualTo("OR");
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[0].scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[0].schema.not.const").isBoolean()
            .isTrue();
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[1].scope").isString()
            .isEqualTo(response.get("elements").get(1).get("scope").asText());
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[1].schema.not.const").isBoolean()
            .isFalse();
    }

    static final class NotOr extends Not {

        public NotOr(final Expression first, final Expression second) {
            super(new Or(first, second));
        }

    }

    @Test
    void testNotOr() {

        final class NotOrSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            interface AnotherBooleanIsFalse {
            }

            @Signal(id = AnotherBooleanIsFalse.class, condition = FalseCondition.class)
            boolean m_anotherBoolean;

            @Effect(signals = {SomeBooleanIsTrue.class, AnotherBooleanIsFalse.class}, type = EffectType.ENABLE,
                operation = NotOr.class)
            boolean m_effect;
        }
        final var response = buildTestUiSchema(NotOrSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");

        assertThatJson(response).inPath("$.elements[2].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[2].rule.effect").isString().isEqualTo("ENABLE");
        assertThatJson(response).inPath("$.elements[2].rule.condition.type").isString().isEqualTo("AND");
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[0].scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[0].schema.not.const").isBoolean()
            .isTrue();
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[1].scope").isString()
            .isEqualTo(response.get("elements").get(1).get("scope").asText());
        assertThatJson(response).inPath("$.elements[2].rule.condition.conditions[1].schema.not.const").isBoolean()
            .isFalse();
    }

    static final class DoubleNegation extends Not {

        public DoubleNegation(final Expression operation) {
            super(new Not(operation));
        }

    }

    @Test
    void testDoubleNegation() {

        final class DoubleNegationSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Effect(signals = SomeBooleanIsTrue.class, type = EffectType.ENABLE, operation = DoubleNegation.class)
            boolean m_effect;
        }
        final var response = buildTestUiSchema(DoubleNegationSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("ENABLE");
        assertThatJson(response).inPath("$.elements[1].rule.condition.scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.const").isBoolean().isTrue();
    }

    static final class OperationTakingOneCondition extends And {

        @SuppressWarnings("unused")
        public OperationTakingOneCondition(final Expression operation) {
            super();
        }

    }

    static final class OperationTakingTwoCondition extends And {

        @SuppressWarnings("unused")
        public OperationTakingTwoCondition(final Expression operation1, final Expression operation2) {
            super();
        }

    }

    @Test
    void testThrowsIfAnInvalidNumberOfConditionsIsProvided() {

        final class OperationWithOneConditionSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Effect(signals = {SomeBooleanIsTrue.class, SomeBooleanIsTrue.class}, type = EffectType.ENABLE,
                operation = OperationTakingOneCondition.class)
            boolean m_effect;
        }

        final class OperationWithTwoConditionSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Effect(signals = SomeBooleanIsTrue.class, type = EffectType.ENABLE,
                operation = OperationTakingTwoCondition.class)
            boolean m_effect;
        }

        final class MultipleConditionsWithoutOperationSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Effect(signals = {SomeBooleanIsTrue.class, SomeBooleanIsTrue.class}, type = EffectType.ENABLE)
            boolean m_effect;
        }

        final class NoConditionsSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Effect(signals = {}, type = EffectType.ENABLE)
            boolean m_effect;
        }

        assertThrows(UiSchemaGenerationException.class,
            () -> buildTestUiSchema(OperationWithOneConditionSettings.class));
        assertThrows(UiSchemaGenerationException.class,
            () -> buildTestUiSchema(OperationWithTwoConditionSettings.class));
        assertThrows(UiSchemaGenerationException.class,
            () -> buildTestUiSchema(MultipleConditionsWithoutOperationSettings.class));
        assertThrows(UiSchemaGenerationException.class, () -> buildTestUiSchema(NoConditionsSettings.class));
    }

    final class LayoutWithEffect {
        @HorizontalLayout()
        @Effect(signals = EffectOnLayoutPartSettings.SomeBooleanIsTrue.class, type = EffectType.DISABLE)
        interface OptionalHorizontalLayout {
        }

    }

    final class EffectOnLayoutPartSettings implements DefaultNodeSettings {

        interface SomeBooleanIsTrue {
        }

        @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
        @Layout(LayoutWithEffect.class)
        boolean m_someBoolean;

        @Layout(LayoutWithEffect.OptionalHorizontalLayout.class)
        boolean m_tagetSetting;
    }

    @Test
    void testEffectOnLayoutPart() {

        final var response = buildTestUiSchema(EffectOnLayoutPartSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("HorizontalLayout");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("DISABLE");
        assertThatJson(response).inPath("$.elements[1].rule.condition.scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.const").isBoolean().isTrue();
    }

    private static ObjectNode buildTestUiSchema(final Class<? extends DefaultNodeSettings> settingsClass) {
        return JsonFormsUiSchemaUtilTest.buildUiSchema(Map.of("test", settingsClass));
    }

}