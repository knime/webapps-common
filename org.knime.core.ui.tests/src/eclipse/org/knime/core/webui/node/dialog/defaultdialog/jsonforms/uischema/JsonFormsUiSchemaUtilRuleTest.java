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
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtilTest.buildTestUiSchema;

import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.layout.HorizontalLayout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.rule.And;
import org.knime.core.webui.node.dialog.defaultdialog.rule.ArrayContainsCondition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Condition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.ConstantSignal;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect.EffectType;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Expression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.FalseCondition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.HasMultipleItemsCondition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.IsNoneColumnStringCondition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.IsSpecificStringCondition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Not;
import org.knime.core.webui.node.dialog.defaultdialog.rule.OneOfEnumCondition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Or;
import org.knime.core.webui.node.dialog.defaultdialog.rule.PatternCondition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Signal;
import org.knime.core.webui.node.dialog.defaultdialog.rule.TrueCondition;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.ColumnSelection;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.IsNoneColumnCondition;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.IsSpecificColumnCondition;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LatentWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;

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

            @Widget
            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Widget
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

            @Widget
            @Signal(condition = OneOrTwo.class)
            OneTwoOrThree m_someBoolean;

            @Widget
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

            @Widget
            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Widget
            @Effect(signals = SomeBooleanIsTrue.class, type = EffectType.DISABLE)
            boolean m_disable;

            @Widget
            @Effect(signals = SomeBooleanIsTrue.class, type = EffectType.ENABLE)
            boolean m_enable;

            @Widget
            @Effect(signals = SomeBooleanIsTrue.class, type = EffectType.HIDE)
            boolean m_hide;

            @Widget
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

            @Widget
            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            interface AnotherBooleanIsFalse {
            }

            @Widget
            @Signal(id = AnotherBooleanIsFalse.class, condition = FalseCondition.class)
            boolean m_anotherBoolean;

            @Widget
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
    void testConstantEffect() {
        final class ConstantEffectSettings implements DefaultNodeSettings {
            static final class AlwaysTrueSignal implements ConstantSignal {

                @Override
                public boolean applies(final DefaultNodeSettingsContext context) {
                    return true;
                }
            }

            static final class AlwaysFalseSignal implements ConstantSignal {

                @Override
                public boolean applies(final DefaultNodeSettingsContext context) {
                    return false;
                }
            }

            @Widget
            @Effect(signals = AlwaysTrueSignal.class, type = EffectType.DISABLE)
            boolean m_constantlyDisabled;

            @Widget
            @Effect(signals = AlwaysFalseSignal.class, type = EffectType.DISABLE)
            boolean m_constantlyEnabled;
        }

        final var response = buildTestUiSchema(ConstantEffectSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].rule.effect").isString().isEqualTo("DISABLE");
        assertThatJson(response).inPath("$.elements[0].rule.condition").isObject().doesNotContainKeys("schema",
            "scope");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("DISABLE");
        assertThatJson(response).inPath("$.elements[1].rule.condition").isObject().doesNotContainKey("scope");
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.const").isBoolean().isTrue();
    }

    @Test
    void testThrowsIfConstantIsUsedAsSignalIdentifier() {
        final class MisusedEffectSettings implements DefaultNodeSettings {
            static final class InvalidSignal implements ConstantSignal {

                @Override
                public boolean applies(final DefaultNodeSettingsContext context) {
                    return true;
                }
            }

            @Widget
            @Effect(signals = InvalidSignal.class, type = EffectType.DISABLE)
            boolean m_fieldWithInvalidSignal;

            @Widget
            @Signal(id = InvalidSignal.class, condition = TrueCondition.class)
            boolean m_signalBoolean;
        }

        assertThrows(UiSchemaGenerationException.class, () -> buildTestUiSchema(MisusedEffectSettings.class));
    }

    @Test
    void testOr() {
        final class OrSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Widget
            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            interface AnotherBooleanIsFalse {
            }

            @Widget
            @Signal(id = AnotherBooleanIsFalse.class, condition = FalseCondition.class)
            boolean m_anotherBoolean;

            @Widget
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

            @Widget
            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Widget
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

            @Widget
            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            interface AnotherBooleanIsFalse {
            }

            @Widget
            @Signal(id = AnotherBooleanIsFalse.class, condition = FalseCondition.class)
            boolean m_anotherBoolean;

            @Widget
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

            @Widget
            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            interface AnotherBooleanIsFalse {
            }

            @Widget
            @Signal(id = AnotherBooleanIsFalse.class, condition = FalseCondition.class)
            boolean m_anotherBoolean;

            @Widget
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

            @Widget
            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Widget
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

            @Widget
            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Widget
            @Effect(signals = {SomeBooleanIsTrue.class, SomeBooleanIsTrue.class}, type = EffectType.ENABLE,
                operation = OperationTakingOneCondition.class)
            boolean m_effect;
        }

        final class OperationWithTwoConditionSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Widget
            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Widget
            @Effect(signals = SomeBooleanIsTrue.class, type = EffectType.ENABLE,
                operation = OperationTakingTwoCondition.class)
            boolean m_effect;
        }

        final class MultipleConditionsWithoutOperationSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Widget
            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Widget
            @Effect(signals = {SomeBooleanIsTrue.class, SomeBooleanIsTrue.class}, type = EffectType.ENABLE)
            boolean m_effect;
        }

        final class NoConditionsSettings implements DefaultNodeSettings {
            interface SomeBooleanIsTrue {
            }

            @Widget
            @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
            boolean m_someBoolean;

            @Widget
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

        @Widget
        @Signal(id = SomeBooleanIsTrue.class, condition = TrueCondition.class)
        @Layout(LayoutWithEffect.class)
        boolean m_someBoolean;

        @Widget
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

    @Test
    void testHasMultipleItemsCondition() {

        final class HasMultipleItemsConditionSettings implements DefaultNodeSettings {

            interface HasMultipleItemsTest {
            }

            @Widget
            @Signal(id = HasMultipleItemsTest.class, condition = HasMultipleItemsCondition.class)
            ArraySettings[] m_arrayElements;

            @Widget
            @Effect(signals = HasMultipleItemsTest.class, type = EffectType.SHOW)
            boolean m_targetSetting;

            class ArraySettings {

                String m_stringField1;

                String m_stringField2;
            }
        }

        final var response = buildTestUiSchema(HasMultipleItemsConditionSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("arrayElements");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("targetSetting");
        assertThatJson(response).inPath("$.elements[1].rule").isObject().containsKey("condition");
        assertThatJson(response).inPath("$.elements[1].rule.condition").isObject().containsKey("schema");
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema").isObject().containsKey("minItems");
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.minItems").isNumber().isEqualTo("2");
    }

    @Test
    void testRuleWithRepeatedSignals() {
        final class RepeatedSignalsTestSettings implements DefaultNodeSettings {

            enum MyEnum {
                    A, B, C;

                static class IsA extends OneOfEnumCondition<MyEnum> {

                    @Override
                    public MyEnum[] oneOf() {
                        return new MyEnum[]{A};
                    }

                }

                static class IsAorB extends OneOfEnumCondition<MyEnum> {

                    @Override
                    public MyEnum[] oneOf() {
                        return new MyEnum[]{A, B};
                    }

                }
            }

            @Widget
            @Signal(condition = MyEnum.IsA.class)
            @Signal(condition = MyEnum.IsAorB.class)
            MyEnum m_foo;

            @Widget
            @Effect(signals = MyEnum.IsA.class, type = EffectType.SHOW)
            boolean m_showIfA;

            @Widget
            @Effect(signals = MyEnum.IsAorB.class, type = EffectType.SHOW)
            boolean m_showIfB;
        }

        final var response = buildTestUiSchema(RepeatedSignalsTestSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("showIfA");
        assertThatJson(response).inPath("$.elements[1]").isObject().containsKey("rule");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("SHOW");
        assertThatJson(response).inPath("$.elements[1].rule.condition").isObject().containsKey("scope");
        assertThatJson(response).inPath("$.elements[1].rule.condition.scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.oneOf").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.oneOf[0].const").isString().isEqualTo("A");
        assertThatJson(response).inPath("$.elements[2].scope").isString().contains("showIfB");
        assertThatJson(response).inPath("$.elements[2]").isObject().containsKey("rule");
        assertThatJson(response).inPath("$.elements[2].rule.effect").isString().isEqualTo("SHOW");
        assertThatJson(response).inPath("$.elements[2].rule.condition").isObject().containsKey("scope");
        assertThatJson(response).inPath("$.elements[2].rule.condition.scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[2].rule.condition.schema.oneOf").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[2].rule.condition.schema.oneOf[0].const").isString().isEqualTo("A");
        assertThatJson(response).inPath("$.elements[2].rule.condition.schema.oneOf[1].const").isString().isEqualTo("B");
    }

    @Test
    void testIgnoreOnMissingSignals() {
        final class EffectWithoutSignalsSettings implements DefaultNodeSettings {

            interface UnmetCondition {
            }

            @Widget
            @Effect(signals = UnmetCondition.class, type = EffectType.HIDE, ignoreOnMissingSignals = true)
            boolean m_setting;

        }

        final var response = buildTestUiSchema(EffectWithoutSignalsSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("setting");
        assertThatJson(response).inPath("$.elements[0]").isObject().doesNotContainKey("rule");

    }

    @Test
    void testThrowsIfMissingSignalsAreNotIgnored() {
        final class EffectWithoutSignalsSettings implements DefaultNodeSettings {

            interface UnmetCondition {
            }

            @Widget
            @Effect(signals = UnmetCondition.class, type = EffectType.HIDE)
            boolean m_setting;

        }

        assertThat(
            assertThrows(UiSchemaGenerationException.class, () -> buildTestUiSchema(EffectWithoutSignalsSettings.class))
                .getMessage())
                    .isEqualTo(String.format(
                        "Error when resolving @Effect annotation for #/properties/test/properties/setting.:"
                            + " Missing source annotation: %s. "
                            + "If this is wanted and the rule should be ignored instead of throwing this error,"
                            + " use the respective flag in the @Effect annotation.",
                        EffectWithoutSignalsSettings.UnmetCondition.class.getName()));

    }

    @Test
    @SuppressWarnings("unused")
    void testEffectAnnotationOnClass() {

        final class SubSubSettings implements WidgetGroup {
            @Widget
            String m_subSubEffectSetting;
        }

        @Effect(signals = TrueCondition.class, type = EffectType.HIDE)
        class SubSettings implements WidgetGroup {

            @Widget
            String m_subEffectSetting;

            @Widget
            SubSubSettings m_subSubSettings;
        }

        final class ExtendingSubSettings extends SubSettings {
            @Widget
            String m_extendingSetting;
        }

        @Effect(signals = TrueCondition.class, type = EffectType.HIDE)
        final class ExtendingSubSettingsWithExtraAnnotation extends SubSettings {
            @Widget
            String m_extendingWithExtraEffectSetting;
        }

        final class EffectOnClassSettings implements DefaultNodeSettings {

            @Widget
            @Signal(condition = TrueCondition.class)
            boolean m_signalSetting;

            SubSettings m_subSettings;

            ExtendingSubSettings m_extendingSubSettings;

            ExtendingSubSettingsWithExtraAnnotation m_extendingSubSettingsWithExtraAnnotation;

        }

        final var response = buildTestUiSchema(EffectOnClassSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(9);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("signalSetting");
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("subEffectSetting");
        assertThatJson(response).inPath("$.elements[1].rule").isObject();
        assertThatJson(response).inPath("$.elements[2].scope").isString().contains("subSubEffectSetting");
        assertThatJson(response).inPath("$.elements[2].rule").isObject();
        assertThatJson(response).inPath("$.elements[5].scope").isString().contains("extendingSetting");
        assertThatJson(response).inPath("$.elements[5]").isObject().doesNotContainKey("rule");
        assertThatJson(response).inPath("$.elements[8].scope").isString().contains("extendingWithExtraEffectSetting");
        assertThatJson(response).inPath("$.elements[8].rule").isObject();
    }

    static class IsTestColumnCondition extends IsSpecificColumnCondition {
        @Override
        public String getColumnName() {
            return "foo";
        }
    }

    @Test
    void testIsSpecificColumnCondition() {

        final class ChoicesWithSpecificColumnCondition implements DefaultNodeSettings {

            interface TestColumnCondition {
            }

            @Widget(title = "Foo")
            @ChoicesWidget(choices = TestChoicesProvider.class)
            @Signal(id = TestColumnCondition.class, condition = IsTestColumnCondition.class)
            ColumnSelection columnSelection = new ColumnSelection();

            @Widget
            @Effect(signals = TestColumnCondition.class, type = EffectType.SHOW)
            boolean someConditionalSetting = true;

        }

        final var response = buildTestUiSchema(ChoicesWithSpecificColumnCondition.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("SHOW");
        assertThatJson(response).inPath("$.elements[1].rule.condition.scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.properties.selected.const").isString()
            .isEqualTo("foo");
    }

    @Test
    void testIsNoneColumnCondition() {
        final class ChoicesWithNoneColumnCondition implements DefaultNodeSettings {
            @Widget(title = "Foo")
            @ChoicesWidget(choices = TestChoicesProvider.class)
            @Signal(condition = IsNoneColumnCondition.class)
            ColumnSelection columnSelection = new ColumnSelection();

            @Widget
            @Effect(signals = IsNoneColumnCondition.class, type = EffectType.SHOW)
            boolean someConditionalSetting = true;
        }

        final var response = buildTestUiSchema(ChoicesWithNoneColumnCondition.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("SHOW");
        assertThatJson(response).inPath("$.elements[1].rule.condition.scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.properties.selected.const").isString()
            .isEqualTo("<none>");
    }

    @Test
    void testIsNoneStringCondition() {
        final class ChoicesWithNoneColumnCondition implements DefaultNodeSettings {
            @Widget(title = "Foo")
            @ChoicesWidget(choices = TestChoicesProvider.class)
            @Signal(condition = IsNoneColumnStringCondition.class)
            String columnSelection;

            @Widget
            @Effect(signals = IsNoneColumnStringCondition.class, type = EffectType.SHOW)
            boolean someConditionalSetting = true;
        }
        final var response = buildTestUiSchema(ChoicesWithNoneColumnCondition.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("SHOW");
        assertThatJson(response).inPath("$.elements[1].rule.condition.scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.const").isString().isEqualTo("<none>");
    }

    final static class TestPatternCondition extends PatternCondition {
        static String PATTERN = "myPattern$";

        @Override
        public String getPattern() {
            return PATTERN;
        }
    }

    @Test
    void testPatternCondition() {

        final class PatternConditionTestSettings implements DefaultNodeSettings {

            @Widget
            @Signal(condition = TestPatternCondition.class)
            String patternSetting;

            @Widget
            @Effect(signals = TestPatternCondition.class, type = EffectType.SHOW)
            boolean effectSetting;
        }
        final var response = buildTestUiSchema(PatternConditionTestSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("SHOW");
        assertThatJson(response).inPath("$.elements[1].rule.condition.scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.pattern").isString()
            .isEqualTo(TestPatternCondition.PATTERN);
    }

    @Test
    void testArrayContainsCondition() {

        final class ArrayContainsConditionTestSettings implements DefaultNodeSettings {

            static class Element {

                @SuppressWarnings("unused")
                String m_value = "myValue";
            }

            static class IsFooCondition extends IsSpecificStringCondition {

                static final String FOO = "Foo";

                @Override
                public String getValue() {
                    return FOO;
                }

            }

            static class ArrayContainsFooValueCondition extends ArrayContainsCondition {

                @Override
                public Class<? extends Condition> getItemCondition() {
                    return IsFooCondition.class;
                }

                @Override
                public String[] getItemFieldPath() {
                    return new String[]{"value"};
                }

            }

            @Widget
            @Signal(condition = ArrayContainsFooValueCondition.class)
            Element[] m_array;

            @Widget
            @Effect(signals = ArrayContainsFooValueCondition.class, type = EffectType.SHOW)
            boolean effectSetting;
        }
        final var response = buildTestUiSchema(ArrayContainsConditionTestSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("SHOW");
        assertThatJson(response).inPath("$.elements[1].rule.condition.scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.contains.properties.value.const")
            .isString().isEqualTo(ArrayContainsConditionTestSettings.IsFooCondition.FOO);
    }

    @Test
    void testLatentWidgetSignals() {
        final class SettingsWithLatentWidgetSignal implements DefaultNodeSettings {

            static final class ValueProvider implements StateProvider<Boolean> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    // fill with dependencies
                }

                @Override
                public Boolean computeState(final DefaultNodeSettingsContext context) {
                    // whenever the condition is fulfilled
                    return true;
                }

            }

            @LatentWidget
            @Widget(valueProvider = ValueProvider.class)
            @Signal(condition = TrueCondition.class)
            Boolean m_bool;

            @Widget
            @Effect(signals = TrueCondition.class, type = EffectType.HIDE)
            String m_effected;

        }

        final var response = buildTestUiSchema(SettingsWithLatentWidgetSignal.class);

        assertThatJson(response).inPath("$.elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[0].rule.effect").isString().isEqualTo("HIDE");
    }

}
