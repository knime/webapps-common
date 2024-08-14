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
import org.knime.core.data.def.StringCell;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.layout.HorizontalLayout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.ColumnSelection;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Effect.EffectType;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Predicate;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.PredicateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Reference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueReference;

/**
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class JsonFormsUiSchemaUtilRuleTest {

    @Test
    void testSimpleRule() {

        final class SimpleRuleSettings implements DefaultNodeSettings {

            static final class SomeBoolean implements Reference<Boolean> {
            }

            @Widget(title = "", description = "")
            @ValueReference(SomeBoolean.class)
            boolean m_someBoolean;

            static final class SomeBooleanIsTrue implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getBoolean(SomeBoolean.class).isTrue();
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = SomeBooleanIsTrue.class, type = EffectType.DISABLE)
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
    void testEffect() {

        final class EffectSettings implements DefaultNodeSettings {

            static final class DummyCondition implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getConstant(context -> true);
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = DummyCondition.class, type = EffectType.DISABLE)
            boolean m_disable;

            @Widget(title = "", description = "")
            @Effect(predicate = DummyCondition.class, type = EffectType.ENABLE)
            boolean m_enable;

            @Widget(title = "", description = "")
            @Effect(predicate = DummyCondition.class, type = EffectType.HIDE)
            boolean m_hide;

            @Widget(title = "", description = "")
            @Effect(predicate = DummyCondition.class, type = EffectType.SHOW)
            boolean m_show;

        }

        final var response = buildTestUiSchema(EffectSettings.class);
        assertThatJson(response).inPath("$.elements[0].rule.effect").isString().isEqualTo("DISABLE");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("ENABLE");
        assertThatJson(response).inPath("$.elements[2].rule.effect").isString().isEqualTo("HIDE");
        assertThatJson(response).inPath("$.elements[3].rule.effect").isString().isEqualTo("SHOW");
    }

    @Test
    void testEffectInsideWidget() {

        final class EffectSettings implements DefaultNodeSettings {

            static final class DummyCondition implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getConstant(context -> true);
                }

            }

            @Widget(title = "", description = "",
                effect = @Effect(predicate = DummyCondition.class, type = EffectType.DISABLE))
            boolean m_disable;

        }

        final var response = buildTestUiSchema(EffectSettings.class);
        assertThatJson(response).inPath("$.elements[0].rule.effect").isString().isEqualTo("DISABLE");
    }

    @Test
    void testThrowsOnEffectInsideWidgetAndOnField() {

        final class EffectSettings implements DefaultNodeSettings {

            static final class DummyCondition implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getConstant(context -> true);
                }

            }

            @Effect(predicate = DummyCondition.class, type = EffectType.DISABLE)
            @Widget(title = "", description = "",
                effect = @Effect(predicate = DummyCondition.class, type = EffectType.DISABLE))
            boolean m_disable;

        }

        assertThrows(IllegalStateException.class, () -> buildTestUiSchema(EffectSettings.class));
    }

    @Test
    void testConstantEffect() {
        final class ConstantEffectSettings implements DefaultNodeSettings {

            static final class AlwaysTruePredicate implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getConstant(context -> true);
                }

            }

            static final class AlwaysFalsePredicate implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getConstant(context -> false);
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = AlwaysTruePredicate.class, type = EffectType.DISABLE)
            boolean m_constantlyDisabled;

            @Widget(title = "", description = "")
            @Effect(predicate = AlwaysFalsePredicate.class, type = EffectType.DISABLE)
            boolean m_constantlyEnabled;
        }

        final var response = buildTestUiSchema(ConstantEffectSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].rule.effect").isString().isEqualTo("DISABLE");
        assertThatJson(response).inPath("$.elements[0].rule.condition").isObject().doesNotContainKey("scope");
        assertThatJson(response).inPath("$.elements[0].rule.condition.schema").isObject().isEmpty();
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("DISABLE");
        assertThatJson(response).inPath("$.elements[1].rule.condition").isObject().doesNotContainKey("scope");
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.not").isObject().isEmpty();
    }

    @Test
    void testAnd() {
        final class OrSettings implements DefaultNodeSettings {
            static final class SomeBoolean implements Reference<Boolean> {
            }

            @Widget(title = "", description = "")
            @ValueReference(SomeBoolean.class)
            boolean m_someBoolean;

            static final class AnotherBoolean implements Reference<Boolean> {
            }

            @Widget(title = "", description = "")
            @ValueReference(AnotherBoolean.class)
            boolean m_anotherBoolean;

            static final class SomeBooleanAndNotAnotherBoolean implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return and(//
                        i.getBoolean(SomeBoolean.class).isTrue(), //
                        i.getBoolean(AnotherBoolean.class).isFalse()//
                    );
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = SomeBooleanAndNotAnotherBoolean.class, type = EffectType.ENABLE)
            boolean m_effect;
        }
        final var response = buildTestUiSchema(OrSettings.class);
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
        final class AndSettings implements DefaultNodeSettings {
            static final class SomeBoolean implements Reference<Boolean> {
            }

            @Widget(title = "", description = "")
            @ValueReference(SomeBoolean.class)
            boolean m_someBoolean;

            static final class AnotherBoolean implements Reference<Boolean> {
            }

            @Widget(title = "", description = "")
            @ValueReference(AnotherBoolean.class)
            boolean m_anotherBoolean;

            static final class SomeBooleanAndNotAnotherBoolean implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return or(//
                        i.getBoolean(SomeBoolean.class).isTrue(), //
                        i.getBoolean(AnotherBoolean.class).isFalse()//
                    );
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = SomeBooleanAndNotAnotherBoolean.class, type = EffectType.ENABLE)
            boolean m_effect;
        }
        final var response = buildTestUiSchema(AndSettings.class);
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
            static final class SomeBoolean implements Reference<Boolean> {
            }

            @Widget(title = "", description = "")
            @ValueReference(SomeBoolean.class)
            boolean m_someBoolean;

            static final class MyCondition implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return not(i.getBoolean(SomeBoolean.class).isTrue());
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = MyCondition.class, type = EffectType.ENABLE)
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

    @Test
    void testNotAnd() {

        final class NotAndSettings implements DefaultNodeSettings {
            static final class SomeBoolean implements Reference<Boolean> {
            }

            @Widget(title = "", description = "")
            @ValueReference(SomeBoolean.class)
            boolean m_someBoolean;

            static final class AnotherBoolean implements Reference<Boolean> {
            }

            @Widget(title = "", description = "")
            @ValueReference(AnotherBoolean.class)
            boolean m_anotherBoolean;

            static final class MyCondition implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return not(and(//
                        i.getBoolean(SomeBoolean.class).isTrue(), //
                        i.getBoolean(AnotherBoolean.class).isFalse()//
                    ));
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = MyCondition.class, type = EffectType.ENABLE)
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

    @Test
    void testNotOr() {

        final class NotOrSettings implements DefaultNodeSettings {
            static final class SomeBoolean implements Reference<Boolean> {
            }

            @Widget(title = "", description = "")
            @ValueReference(SomeBoolean.class)
            boolean m_someBoolean;

            static final class AnotherBoolean implements Reference<Boolean> {
            }

            @Widget(title = "", description = "")
            @ValueReference(AnotherBoolean.class)
            boolean m_anotherBoolean;

            static final class MyCondition implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return not(or(//
                        i.getBoolean(SomeBoolean.class).isTrue(), //
                        i.getBoolean(AnotherBoolean.class).isFalse()//
                    ));
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = MyCondition.class, type = EffectType.ENABLE)
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

    @Test
    void testDoubleNegation() {

        final class DoubleNegationSettings implements DefaultNodeSettings {
            static final class SomeBoolean implements Reference<Boolean> {
            }

            @Widget(title = "", description = "")
            @ValueReference(SomeBoolean.class)
            boolean m_someBoolean;

            static final class MyCondition implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return not(not(i.getBoolean(SomeBoolean.class).isTrue()));
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = MyCondition.class, type = EffectType.ENABLE)
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

    final class LayoutWithEffect {

        static final class MyCondition implements PredicateProvider {

            @Override
            public Predicate init(final PredicateInitializer i) {
                return i.getBoolean(EffectOnLayoutPartSettings.SomeBoolean.class).isTrue();
            }

        }

        @HorizontalLayout()
        @Effect(predicate = MyCondition.class, type = EffectType.DISABLE)
        interface OptionalHorizontalLayout {
        }

    }

    final class EffectOnLayoutPartSettings implements DefaultNodeSettings {

        static final class SomeBoolean implements Reference<Boolean> {
        }

        @Widget(title = "", description = "")
        @ValueReference(SomeBoolean.class)
        boolean m_someBoolean;

        @Widget(title = "", description = "")
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

            static final class ArrayElements implements Reference<ArraySettings[]> {
            }

            @Widget(title = "", description = "")
            @ValueReference(ArrayElements.class)
            ArraySettings[] m_arrayElements;

            static final class ArrayElementsHasMultipleItems implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getArray(ArrayElements.class).hasMultipleItems();
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = ArrayElementsHasMultipleItems.class, type = EffectType.SHOW)
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
    void testReferencesIsMissing() {
        final class EffectWithoutReferenceSettings implements DefaultNodeSettings {

            static final class UnmetReference implements Reference<Boolean> {
            }

            static final class MetReference implements Reference<Boolean> {
            }

            static final class UnmetReferenceIsPresent implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    if (i.isMissing(UnmetReference.class)) {
                        return i.never();
                    }
                    return i.always();
                }

            }

            static final class MetReferenceIsPresent implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    if (i.isMissing(MetReference.class)) {
                        return i.never();
                    }
                    return i.always();
                }

            }

            @ValueReference(MetReference.class)
            boolean m_referenced;

            @Widget(title = "", description = "")
            @Effect(predicate = UnmetReferenceIsPresent.class, type = EffectType.HIDE)
            boolean m_effectSetting1;

            @Widget(title = "", description = "")
            @Effect(predicate = MetReferenceIsPresent.class, type = EffectType.HIDE)
            boolean m_effectSetting2;

        }

        final var response = buildTestUiSchema(EffectWithoutReferenceSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("effectSetting1");
        assertThatJson(response).inPath("$.elements[0].rule.condition.schema.not").isObject().isEmpty();
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("effectSetting2");
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema").isObject().isEmpty();

    }

    @Test
    void testThrowsOnMissingReferences() {
        final class EffectWithoutReferenceSettings implements DefaultNodeSettings {

            static final class UnmetReference implements Reference<Boolean> {
            }

            static final class MyCondition implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getBoolean(UnmetReference.class).isTrue();
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = MyCondition.class, type = EffectType.HIDE)
            boolean m_setting;

        }

        assertThat(assertThrows(UiSchemaGenerationException.class,
            () -> buildTestUiSchema(EffectWithoutReferenceSettings.class)).getMessage())
                .isEqualTo(String.format(
                    "Error when resolving @Effect annotation for #/properties/model/properties/setting.: "
                        + "Missing reference annotation: %s. If this is correct and desired, "
                        + "check for that in advance using PredicateInitializer#isMissing.",
                    EffectWithoutReferenceSettings.UnmetReference.class.getName()));

    }

    static final class SubSubSettings implements WidgetGroup {
        @Widget(title = "", description = "")
        String m_subSubEffectSetting;
    }

    @Effect(predicate = EffectOnClassSettings.SomeBooleanIsTrue.class, type = EffectType.HIDE)
    static class SubSettings implements WidgetGroup {

        @Widget(title = "", description = "")
        String m_subEffectSetting;

        @Widget(title = "", description = "")
        SubSubSettings m_subSubSettings;
    }

    static final class ExtendingSubSettings extends SubSettings {
        @Widget(title = "", description = "")
        String m_extendingSetting;
    }

    @Effect(predicate = EffectOnClassSettings.SomeBooleanIsTrue.class, type = EffectType.HIDE)
    static final class ExtendingSubSettingsWithExtraAnnotation extends SubSettings {
        @Widget(title = "", description = "")
        String m_extendingWithExtraEffectSetting;
    }

    static final class EffectOnClassSettings implements DefaultNodeSettings {

        static final class SomeBoolean implements Reference<Boolean> {

        }

        static final class SomeBooleanIsTrue implements PredicateProvider {

            @Override
            public Predicate init(final PredicateInitializer i) {
                return i.getBoolean(SomeBoolean.class).isTrue();
            }

        }

        @Widget(title = "", description = "")
        @ValueReference(SomeBoolean.class)
        boolean m_someBoolean;

        SubSettings m_subSettings;

        ExtendingSubSettings m_extendingSubSettings;

        ExtendingSubSettingsWithExtraAnnotation m_extendingSubSettingsWithExtraAnnotation;

    }

    @Test
    @SuppressWarnings("unused")
    void testEffectAnnotationOnClass() {
        final var response = buildTestUiSchema(EffectOnClassSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(9);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("someBoolean");
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("subEffectSetting");
        assertThatJson(response).inPath("$.elements[1].rule").isObject();
        assertThatJson(response).inPath("$.elements[2].scope").isString().contains("subSubEffectSetting");
        assertThatJson(response).inPath("$.elements[2].rule").isObject();
        assertThatJson(response).inPath("$.elements[5].scope").isString().contains("extendingSetting");
        assertThatJson(response).inPath("$.elements[5]").isObject().doesNotContainKey("rule");
        assertThatJson(response).inPath("$.elements[8].scope").isString().contains("extendingWithExtraEffectSetting");
        assertThatJson(response).inPath("$.elements[8].rule").isObject();
    }

    @Test
    void testIsSpecificColumnCondition() {

        final class ChoicesWithSpecificColumnCondition implements DefaultNodeSettings {

            static final class ColumnSelectionReference implements Reference<ColumnSelection> {
            }

            @Widget(title = "Foo", description = "")
            @ChoicesWidget(choices = TestChoicesProvider.class)
            @ValueReference(ColumnSelectionReference.class)
            ColumnSelection columnSelection = new ColumnSelection();

            static final class MyCondition implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getColumnSelection(ColumnSelectionReference.class).hasColumnName("foo");
                }
            }

            @Widget(title = "", description = "")
            @Effect(predicate = MyCondition.class, type = EffectType.SHOW)
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
    void testIsColumnOfTypeCondition() {

        final class ChoicesWithColumnTypeCondition implements DefaultNodeSettings {

            static final class ColumnSelectionReference implements Reference<ColumnSelection> {
            }

            @Widget(title = "Foo", description = "")
            @ChoicesWidget(choices = TestChoicesProvider.class)
            @ValueReference(ColumnSelectionReference.class)
            ColumnSelection columnSelection = new ColumnSelection();

            static final class MyCondition implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getColumnSelection(ColumnSelectionReference.class).hasColumnType(StringCell.class);
                }
            }

            @Widget(title = "", description = "")
            @Effect(predicate = MyCondition.class, type = EffectType.SHOW)
            boolean someConditionalSetting = true;

        }

        final var response = buildTestUiSchema(ChoicesWithColumnTypeCondition.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("SHOW");
        assertThatJson(response).inPath("$.elements[1].rule.condition.scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.properties.compatibleTypes.contains.const")
            .isString().isEqualTo(StringCell.class.getName());
    }

    @Test
    void testIsNoneColumnCondition() {
        final class ChoicesWithNoneColumnCondition implements DefaultNodeSettings {

            static final class ColumnSelectionReference implements Reference<ColumnSelection> {
            }

            @Widget(title = "Foo", description = "")
            @ChoicesWidget(choices = TestChoicesProvider.class)
            @ValueReference(ColumnSelectionReference.class)
            ColumnSelection columnSelection = new ColumnSelection();

            static final class MyCondition implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getColumnSelection(ColumnSelectionReference.class).isNoneColumn();
                }
            }

            @Widget(title = "", description = "")
            @Effect(predicate = MyCondition.class, type = EffectType.SHOW)
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

            static final class ColumnSelectionReference implements Reference<String> {
            }

            @Widget(title = "Foo", description = "")
            @ChoicesWidget(choices = TestChoicesProvider.class)
            @ValueReference(ColumnSelectionReference.class)
            String columnSelection;

            static final class MyCondition implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getString(ColumnSelectionReference.class).isNoneString();
                }
            }

            @Widget(title = "", description = "")
            @Effect(predicate = MyCondition.class, type = EffectType.SHOW)
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

    @Test
    void testPatternCondition() {

        final class PatternConditionTestSettings implements DefaultNodeSettings {
            static final class PatternSetting implements Reference<String> {
            }

            @Widget(title = "", description = "")
            @ValueReference(PatternSetting.class)
            String patternSetting;

            static final class PatternSettingMatchesMyPattern implements PredicateProvider {

                static String PATTERN = "myPattern$";

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getString(PatternSetting.class).matchesPattern(PATTERN);
                }
            }

            @Widget(title = "", description = "")
            @Effect(predicate = PatternSettingMatchesMyPattern.class, type = EffectType.SHOW)
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
            .isEqualTo(PatternConditionTestSettings.PatternSettingMatchesMyPattern.PATTERN);
    }

    @Test
    void testArrayContainsCondition() {

        final class ArrayContainsConditionTestSettings implements DefaultNodeSettings {

            static class Element implements WidgetGroup {
                static final class ElementValueReference implements Reference<String> {
                }

                @ValueReference(ElementValueReference.class)
                String m_value = "myValue";

            }

            static final class ArrayReference implements Reference<Element[]> {
            }

            @Widget(title = "", description = "")
            @ValueReference(ArrayReference.class)
            Element[] m_array;

            static final class ContainsProvider implements PredicateProvider {

                static final String FOO = "Foo";

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getArray(ArrayReference.class).containsElementSatisfying(
                        element -> element.getString(Element.ElementValueReference.class).isEqualTo(FOO));
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = ContainsProvider.class, type = EffectType.SHOW)
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
            .isString().isEqualTo(ArrayContainsConditionTestSettings.ContainsProvider.FOO);
    }

    @Test
    void testComplexArrayContainsCondition() {

        final class ArrayContainsConditionTestSettings implements DefaultNodeSettings {

            static class Element implements WidgetGroup {
                static final class StringField implements Reference<String> {
                }

                @ValueReference(StringField.class)
                String m_value1 = "myValue";

                static final class BooleanField implements Reference<Boolean> {
                }

                @ValueReference(BooleanField.class)
                Boolean m_value2 = true;

            }

            static final class ArrayReference implements Reference<Element[]> {
            }

            @Widget(title = "", description = "")
            @ValueReference(ArrayReference.class)
            Element[] m_array;

            static final class ContainsProvider implements PredicateProvider {

                static final String FOO = "Foo";

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getArray(ArrayReference.class)
                        .containsElementSatisfying(element -> element.getString(Element.StringField.class)
                            .isEqualTo(FOO).and(element.getBoolean(Element.BooleanField.class).isTrue())
                            .or(element.getConstant(context -> true)).negate());
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = ContainsProvider.class, type = EffectType.SHOW)
            boolean effectSetting;
        }
        final var response = buildTestUiSchema(ArrayContainsConditionTestSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[1].rule.effect").isString().isEqualTo("SHOW");
        assertThatJson(response).inPath("$.elements[1].rule.condition.scope").isString()
            .isEqualTo(response.get("elements").get(0).get("scope").asText());
        assertThatJson(response)
            .inPath("$.elements[1].rule.condition.schema.contains.not.anyOf[0].allOf[0].properties.value1.const")
            .isString().isEqualTo(ArrayContainsConditionTestSettings.ContainsProvider.FOO);
        assertThatJson(response)
            .inPath("$.elements[1].rule.condition.schema.contains.not.anyOf[0].allOf[1].properties.value2.const")
            .isBoolean().isEqualTo(true);
        assertThatJson(response).inPath("$.elements[1].rule.condition.schema.contains.not.anyOf[1]").isObject()
            .isEmpty();
    }

    @Test
    void testConditionOnNonWidget() {
        final class SettingsWithNonWidgetReference implements DefaultNodeSettings {

            static final class SomeBoolean implements Reference<Boolean> {

            }

            @ValueReference(SomeBoolean.class)
            Boolean m_someBoolean;

            static final class SomeBooleanIsTrue implements PredicateProvider {

                @Override
                public Predicate init(final PredicateInitializer i) {
                    return i.getBoolean(SomeBoolean.class).isTrue();
                }

            }

            @Widget(title = "", description = "")
            @Effect(predicate = SomeBooleanIsTrue.class, type = EffectType.HIDE)
            String m_effected;

        }

        final var response = buildTestUiSchema(SettingsWithNonWidgetReference.class);

        assertThatJson(response).inPath("$.elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[0].rule.effect").isString().isEqualTo("HIDE");
    }

}
