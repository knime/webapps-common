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
package org.knime.core.webui.node.dialog.impl;

import static org.knime.core.webui.node.dialog.impl.JsonFormsUiSchemaGenerator.CONDITION_TAG;
import static org.knime.core.webui.node.dialog.impl.JsonFormsUiSchemaGenerator.EFFECT_TAG;
import static org.knime.core.webui.node.dialog.impl.JsonFormsUiSchemaGenerator.RULE_TAG;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.knime.core.webui.node.dialog.impl.ui.rule.Condition;
import org.knime.core.webui.node.dialog.impl.ui.rule.JsonFormsCondition;
import org.knime.core.webui.node.dialog.impl.ui.rule.Operation;
import org.knime.core.webui.node.dialog.impl.ui.rule.RuleSource;
import org.knime.core.webui.node.dialog.impl.ui.rule.RuleTarget;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 *
 * @author Paul Bärnreuther
 */
final class UiSchemaRulesGenerator {

    private final ObjectMapper m_mapper;

    private final Map<Class<?>, JsonFormsCondition> m_ruleSourcesMap;

    private final RuleTarget m_ruleTarget;

    private JsonFormsOperationVisitor m_visitor;

    /**
     * @param mapper a object mapper used to resolve the schema objects in any used {@link Condition}
     * @param field a field for which the effect of a rule is to be determined
     * @param ruleSourcesMap the map of all rule sources in the settings context at hand. It maps the ids of
     *            {@link RuleSource} annotations to a construct holding the respective condition and the scope of the
     *            associated field.
     */
    UiSchemaRulesGenerator(final ObjectMapper mapper, final PropertyWriter field,
        final Map<Class<?>, JsonFormsCondition> ruleSourcesMap) {
        m_mapper = mapper;
        m_ruleTarget = field.getAnnotation(RuleTarget.class);
        m_ruleSourcesMap = ruleSourcesMap;
        m_visitor = new JsonFormsOperationVisitor(m_mapper);
    }

    /**
     * Applies a rule to an object node based on the {@link RuleTarget} annotation of a given field. The linked sources
     * are fetched and combined using the provided operator, with nested operations being resolved recursively. For more
     * information on the resolution of different operations, see {@link JsonFormsUiSchemaGenerator}.
     *
     * @param control the object node to which the rule should be applied
     */
    public void applyRulesTo(final ObjectNode control) {
        if (m_ruleTarget == null) {
            return;
        }
        final var rule = control.putObject(RULE_TAG).put(EFFECT_TAG, String.valueOf(m_ruleTarget.effect()));
        final var sources =
            Arrays.asList(m_ruleTarget.sources()).stream().map(m_ruleSourcesMap::get).collect(Collectors.toList());
        final var operationClass = m_ruleTarget.operation();
        rule.set(CONDITION_TAG, extractCondition(sources, operationClass));
    }

    private ObjectNode extractCondition(final List<JsonFormsCondition> sources,
        final Class<? extends Operation> operationClass) {
        if (operationClass.equals(Operation.class)) {
            if (sources.size() != 1) {
                throw new UiSchemaGenerationException(String.format(
                    "There should only be one condition for a rule without an operation but instead there were %s",
                    sources.size()));
            }
            final var source = sources.get(0);
            return source.accept(m_visitor);
        } else {
            return instantiateOperation(operationClass, sources).accept(m_visitor);
        }
    }

    private static Operation instantiateOperation(final Class<? extends Operation> operationClass,
        final List<JsonFormsCondition> conditions) {
        try {
            return instantiateWithSuitableConstructor(operationClass, conditions.stream().toArray(Condition[]::new));
        } catch (InstantiationException | IllegalAccessException | IllegalArgumentException
                | InvocationTargetException ex) {
            throw new UiSchemaGenerationException(
                String.format("Failed to instantiate operation %s", operationClass.getSimpleName()), ex);
        }
    }

    private static Operation instantiateWithSuitableConstructor(final Class<? extends Operation> operationClass,
        final Condition[] conditions)
        throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        final var constructors = operationClass.getDeclaredConstructors();
        final var multiParameterConstructor = getMultiParameterConstructor(constructors, conditions.length);
        if (multiParameterConstructor != null) {
            return (Operation)multiParameterConstructor.newInstance((Object[])conditions);
        }
        final var arrayConstructor = getArrayConstructor(constructors);
        if (arrayConstructor != null) {
            final Object[] parameters = new Object[]{conditions};
            return (Operation)arrayConstructor.newInstance(parameters);
        }
        throw new UiSchemaGenerationException(
            String.format("No valid constructor found for operation %s with %s conditions",
                operationClass.getSimpleName(), conditions.length));
    }

    /**
     * Finds a suitable constructor from the given array of constructors. A suitable constructor is defined as one that
     * accepts a specified number of parameters, each of type {@link Condition}.
     *
     * @param constructors an array of constructors to search through
     * @param numParams the number of parameters the suitable constructor should accept
     * @return the suitable constructor, or null if none is found
     *
     * @example public MyClass(Condition condition1, Condition condition2, Condition condition3) {} public
     *          MyClass(Operation condition1, Operation condition2, Operation condition3) {}
     */
    private static Constructor<?> getMultiParameterConstructor(final Constructor<?>[] constructors,
        final int numParams) {
        return Arrays.asList(constructors).stream().filter(constructor -> {
            final var parameters = constructor.getParameterTypes();
            return parameters.length == numParams && Arrays.asList(parameters).stream()
                .allMatch(paramType -> paramType.isAssignableFrom(Condition.class));
        }).findAny().orElse(null);
    }

    /**
     * Finds a suitable constructor from the given array of constructors. A suitable constructor is defined as one that
     * accepts an array of {@link Condition}s as its sole parameter.
     *
     * @param constructors an array of constructors to search through
     * @return the suitable constructor, or null if none is found
     *
     * @example public MyClass(Condition[] conditions) {}
     * @example public MyClass(Operation... conditions) {}
     *
     */
    private static Constructor<?> getArrayConstructor(final Constructor<?>[] constructors) {
        return Arrays.asList(constructors).stream().filter(constructor -> {
            final var parameters = constructor.getParameterTypes();
            return parameters.length == 1 && parameters[0].isArray()
                && parameters[0].componentType().isAssignableFrom(Condition.class);
        }).findAny().orElse(null);
    }

}
