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

import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_CONDITION;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_EFFECT;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_RULE;

import java.util.Collection;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Predicate;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.PredicateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Effect.EffectType;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.PredicateProvider.PredicateInitializer;
import org.knime.core.webui.node.dialog.defaultdialog.widgettree.WidgetTree;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 *
 * @author Paul Bärnreuther
 */
final class UiSchemaRulesGenerator {

    private final PredicateExtractor m_predicateExtractor;

    private JsonFormsPredicateResolver m_visitor;

    /**
     * @param widgetTrees containing the nodes that the to be generated rules can depend on
     * @param context the node's context (inputs, flow vars)
     */
    UiSchemaRulesGenerator(final Collection<WidgetTree> widgetTrees, final DefaultNodeSettingsContext context) {
        m_predicateExtractor = new PredicateExtractor(widgetTrees, context);
        m_visitor = new JsonFormsPredicateResolver(context);
    }

    /**
     * Applies a rule to an object node based on the {@link Effect} annotation of a given field. The linked sources are
     * fetched and combined using the provided operator, with nested operations being resolved recursively. For more
     * information on the resolution of different operations, see {@link JsonFormsUiSchemaUtil}.
     *
     * @param effect
     * @param control the object node to which the rule should be applied
     */
    public void applyEffectTo(final Effect effect, final ObjectNode control) {
        if (effect == null) {
            return;
        }
        final var predicate = extractPredicateFromAnnotation(effect.predicate());
        writePredicateAsRule(effect.type(), predicate, control);
    }

    private JsonNode writePredicateAsRule(final EffectType type, final Predicate predicate, final ObjectNode control) {
        return control.putObject(TAG_RULE)//
            .put(TAG_EFFECT, String.valueOf(type)) //
            .set(TAG_CONDITION, predicate.accept(m_visitor));
    }

    private Predicate extractPredicateFromAnnotation(final Class<? extends PredicateProvider> predicateProviderClass) {
        try {
            return m_predicateExtractor.createPredicate(predicateProviderClass);
        } catch (InvalidReferenceException e) {
            throw new UiSchemaGenerationException(String.format(
                "Missing reference annotation: %s. "
                    + "If this is correct and desired, check for that in advance using %s.",
                e.getReference().getName(), getIsMissingMethodName()), e);
        }
    }

    /**
     * {@link PredicateInitializer#isMissing}
     */
    private static String getIsMissingMethodName() {
        return String.format("%s#isMissing", PredicateInitializer.class.getSimpleName());
    }

}
