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
 *   Apr 3, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.knime.core.node.util.CheckUtils;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.DefaultPredicateInitializer.ScopeFromReference;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.rule.PredicateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.rule.PredicateProvider.PredicateInitializer;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.ConstantExpression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.ConstantSignal;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.Expression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.JsonFormsExpression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.Operator;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.ScopedExpression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Signal;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Signals;
import org.knime.core.webui.node.dialog.defaultdialog.util.InstantiationUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueReference;
import org.knime.core.webui.node.dialog.defaultdialog.widgettree.WidgetTree;
import org.knime.core.webui.node.dialog.defaultdialog.widgettree.WidgetTreeNode;

/**
 *
 * @author Paul Bärnreuther
 */
final class ExpressionExtractor {

    private final Map<Class<?>, ScopedExpression> m_signalsMap;

    private final DefaultNodeSettingsContext m_context;

    private final PredicateInitializer m_predicateInitializer;

    /**
     * @param widgetTrees to extract references from
     * @param context the node's context (inputs, flow vars)
     */
    ExpressionExtractor(final Collection<WidgetTree> widgetTrees, final DefaultNodeSettingsContext context) {
        m_signalsMap = getSignals(widgetTrees);
        m_context = context;
        m_predicateInitializer = getPredicateInitializer(widgetTrees);
    }

    /**
     * @param widgetTree to extract references from
     * @param context the node's context (inputs, flow vars)
     */
    ExpressionExtractor(final WidgetTree widgetTree, final DefaultNodeSettingsContext context) {
        this(List.of(widgetTree), context);
    }

    private static Map<Class<?>, ScopedExpression> getSignals(final Collection<WidgetTree> widgetTrees) {
        final Map<Class<?>, ScopedExpression> signals = new HashMap<>();
        widgetTrees.stream().flatMap(WidgetTree::getWidgetNodes).forEach(node -> addSignals(signals, node));
        return signals;
    }

    private static void addSignals(final Map<Class<?>, ScopedExpression> signals, final WidgetTreeNode node) {
        getSignalList(node).forEach(signal -> {
            final var conditionClass = signal.condition();
            final var condition = InstantiationUtil.createInstance(conditionClass);
            final var scopedSignal = new ScopedExpression(node, condition);
            final var signalId = signal.id();
            signals.put(signalId.equals(Class.class) ? conditionClass : signalId, scopedSignal);
        });
    }

    private PredicateInitializer getPredicateInitializer(final Collection<WidgetTree> widgetTrees) {
        final var references = getReferences(widgetTrees);
        final var scopeFromReference = new ScopeFromReference() {

            @Override
            public WidgetTreeNode getScope(final Class<?> reference) throws InvalidReferenceException {
                if (references.containsKey(reference)) {
                    return references.get(reference);
                }
                throw new InvalidReferenceException(reference);
            }
        };
        return new DefaultPredicateInitializer(scopeFromReference, m_context);
    }

    /**
     * If a single signal is added, the annotation can only be retrieved by Signal.class If multiple signals are added,
     * the annotations can only be retrieved by Signals.class
     */
    private static List<Signal> getSignalList(final WidgetTreeNode node) {
        var singleSignal = node.getAnnotation(Signal.class);
        if (singleSignal.isPresent()) {
            return List.of(singleSignal.get());
        }

        var multipleSignals = node.getAnnotation(Signals.class);
        if (multipleSignals.isPresent()) {
            return List.of(multipleSignals.get().value());
        }

        return List.of();
    }

    private static Map<Class<?>, WidgetTreeNode> getReferences(final Collection<WidgetTree> widgetTrees) {
        final Map<Class<?>, WidgetTreeNode> references = new HashMap<>();
        widgetTrees.stream().flatMap(WidgetTree::getWidgetAndWidgetTreeNodes)
            .forEach(node -> addReference(references, node));
        return references;
    }

    private static void addReference(final Map<Class<?>, WidgetTreeNode> references, final WidgetTreeNode node) {
        node.getAnnotation(ValueReference.class).map(ValueReference::value)
            .ifPresent(referenceClass -> references.put(referenceClass, node));
    }

    Optional<Expression<JsonFormsExpression>> createExpressionLegacy(final Class<?>[] signalClasses,
        final Class<? extends Operator> operationClass, final boolean ignoreOnMissingSignals) {
        final var expressionList = new ArrayList<JsonFormsExpression>();
        for (var i = 0; i < signalClasses.length; i++) {
            final var signalClass = signalClasses[i];
            final var expressionOptional = createExpressionFromSignal(signalClass, ignoreOnMissingSignals);
            if (expressionOptional.isEmpty()) {
                return Optional.empty(); // "ignoreOnMissingSignals"
            }
            expressionList.add(expressionOptional.get());
        }
        return Optional.of(instantiateOperation(operationClass, expressionList.toArray(JsonFormsExpression[]::new)));
    }

    @SuppressWarnings("unchecked")
    Expression<JsonFormsExpression> createExpression(final Class<? extends PredicateProvider> predicateProviderClass) {
        return (Expression<JsonFormsExpression>)m_predicateInitializer.getPredicate(predicateProviderClass);
    }

    @SuppressWarnings("unchecked")
    Expression<JsonFormsExpression> createExpression(final PredicateProvider predicateProvider) {
        return (Expression<JsonFormsExpression>)m_predicateInitializer.getPredicate(predicateProvider);
    }

    /**
     * Extracts the expression from a signal added to an effect.
     *
     * @param signalClass The signal class as defined in the @Effect annotation.
     * @return Either an expression or an empty optional if the effect has the
     *         {@link Effect#ignoreOnMissingSignals()} set.
     */
    private Optional<JsonFormsExpression> createExpressionFromSignal(final Class<?> signalClass,
        final boolean ignoreOnMissingReferences) {
        JsonFormsExpression expression = m_signalsMap.get(signalClass);
        if (expression == null) {
            if (ConstantSignal.class.isAssignableFrom(signalClass)) {
                try {
                    expression = new ConstantExpression(signalClass.asSubclass(ConstantSignal.class)
                        .getDeclaredConstructor().newInstance().applies(m_context));
                } catch (InstantiationException | IllegalAccessException | IllegalArgumentException
                        | InvocationTargetException | NoSuchMethodException | SecurityException ex) {
                    throw new UiSchemaGenerationException("Unable to instantiate instance of " + signalClass.getName(),
                        ex);
                }
            } else if (ignoreOnMissingReferences) {
                return Optional.empty();
            } else {
                throw new UiSchemaGenerationException(String.format("Missing source annotation: %s. "
                    + "If this is wanted and the rule should be ignored instead of throwing this error, "
                    + "use the respective flag in the @Effect annotation.", signalClass.getName()));
            }
        } else {
            // (artificial design limitation:) input signals not to be used as identifiers in @Signal annotation
            CheckUtils.check(!ConstantSignal.class.isAssignableFrom(signalClass), UiSchemaGenerationException::new,
                () -> String.format(
                    "Invalid source annotation: %s - it denotes a %s, "
                        + "which can not be referenced by a @Signal annotation.", //
                    signalClass, ConstantSignal.class.getSimpleName()));
        }
        return Optional.of(expression);
    }

    private static Expression<JsonFormsExpression> instantiateOperation(
        @SuppressWarnings("rawtypes") final Class<? extends Operator> operationClass,
        final JsonFormsExpression[] expressions) {
        try {
            return instantiateWithSuitableConstructor(operationClass, expressions);
        } catch (IllegalArgumentException ex) {
            throw new UiSchemaGenerationException(
                String.format("Failed to instantiate operation %s", operationClass.getSimpleName()), ex);
        }
    }

    @SuppressWarnings("unchecked")
    private static Operator<JsonFormsExpression> instantiateWithSuitableConstructor(
        @SuppressWarnings("rawtypes") final Class<? extends Operator> operationClass,
        final JsonFormsExpression[] expressions) {
        final var constructors = operationClass.getDeclaredConstructors();
        final var multiParameterConstructor = getMultiParameterConstructor(constructors, expressions.length);
        if (multiParameterConstructor != null) {
            return (Operator<JsonFormsExpression>)InstantiationUtil.createInstance(multiParameterConstructor,
                (Object[])expressions);
        }
        final var arrayConstructor = getArrayConstructor(constructors);
        if (arrayConstructor != null) {
            final var parameters = new Object[]{expressions};
            return (Operator<JsonFormsExpression>)InstantiationUtil.createInstance(arrayConstructor, parameters);
        }
        throw new UiSchemaGenerationException(
            String.format("No valid constructor found for operation %s with %s expressions",
                operationClass.getSimpleName(), expressions.length));
    }

    /**
     * Finds a suitable constructor from the given array of constructors. A suitable constructor is defined as one that
     * accepts a specified number of parameters, each of type {@link Expression}.
     *
     * @param constructors an array of constructors to search through
     * @param numParams the number of parameters the suitable constructor should accept
     * @return the suitable constructor, or null if none is found
     *
     * @example public MyClass(Expression expression1, Expression expression2, Expression expression3) {}
     */
    private static Constructor<?> getMultiParameterConstructor(final Constructor<?>[] constructors,
        final int numParams) {
        return Arrays.asList(constructors).stream().filter(constructor -> {
            final var parameters = constructor.getParameterTypes();
            return parameters.length == numParams && Arrays.asList(parameters).stream()
                .allMatch(paramType -> paramType.isAssignableFrom(Expression.class));
        }).findAny().orElse(null);
    }

    /**
     * Finds a suitable constructor from the given array of constructors. A suitable constructor is defined as one that
     * accepts an array of {@link Expression}s as its sole parameter.
     *
     * @param constructors an array of constructors to search through
     * @return the suitable constructor, or null if none is found
     *
     * @example public MyClass(Expression[] expressions) {}
     * @example public MyClass(Expression... expressions) {}
     *
     */
    private static Constructor<?> getArrayConstructor(final Constructor<?>[] constructors) {
        return Arrays.asList(constructors).stream().filter(constructor -> {
            final var parameters = constructor.getParameterTypes();
            return parameters.length == 1 && parameters[0].isArray()
                && parameters[0].componentType().isAssignableFrom(Expression.class);
        }).findAny().orElse(null);
    }

}
