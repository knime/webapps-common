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
 *   Jun 19, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.rule.ScopedExpression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Signal;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Signals;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser.TraversedField;
import org.knime.core.webui.node.dialog.defaultdialog.util.InstantiationUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Hidden;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 *
 * @author Paul Bärnreuther
 */
public class UiSchemaDefaultNodeSettingsTraverser {

    private final ObjectMapper m_mapper;

    UiSchemaDefaultNodeSettingsTraverser(final ObjectMapper mapper) {
        m_mapper = mapper;
    }

    /**
     * package scoped since this is meant to be used internally only.
     *
     * @author Paul Bärnreuther
     */
    static record TrackedAnnotations(Effect effect) {
    }

    /**
     * A record representing a single control within a node dialog
     *
     * @param scope of the control
     * @param field the associated property writer of the java field
     * @param rootClass the class from which the control originated from
     * @param trackedAnnotations tracked during the traversal.
     */
    public static record JsonFormsControl(String scope, PropertyWriter field, Class<?> rootClass,
        TrackedAnnotations trackedAnnotations) {
    }

    private static record TraversalConsumerPayload(String scope, TraversedField field, Class<?> rootClass) {
    }

    /**
     * layoutPartToControls - A mapping from classes annotated as certain layout parts (see {@link LayoutPart}) to the
     * settings/controls associated to them by {@link Layout} annotations. If a setting has no {@Link Layout} annotation
     * it is associated to {@code null}.
     *
     * signals - the present signal annotations in the default node settings.
     *
     * @author Paul Bärnreuther
     */
    static record TraversalResult(Map<Class<?>, List<JsonFormsControl>> layoutPartToControls,
        Map<Class<?>, ScopedExpression> signals, Collection<JsonFormsControl> fields) {
    }

    TraversalResult traverse(final Map<String, Class<?>> settings) {
        final Collection<JsonFormsControl> fields = new HashSet<>();
        final Map<Class<?>, List<JsonFormsControl>> layoutPartToControls = new HashMap<>();
        final Map<Class<?>, ScopedExpression> signals = new HashMap<>();
        final var addField = getAddFieldConsumer(fields, layoutPartToControls);
        final var addSignal = getAddSignalConsumer(signals);
        settings.forEach((settingsKey, setting) -> traverseSettingsClass(addField, addSignal, settingsKey, setting));
        return new TraversalResult(layoutPartToControls, signals, fields);
    }

    private void traverseSettingsClass(final Consumer<TraversalConsumerPayload> addField,
        final Consumer<TraversalConsumerPayload> addSignal, final String settingsKey, final Class<?> setting) {
        final var traverser = new DefaultNodeSettingsFieldTraverser(m_mapper, setting);
        traverser.traverse(field -> {
            final var scope = toScope(field.path(), settingsKey);
            final var payload = new TraversalConsumerPayload(scope, field, setting);
            addField.accept(payload);
            addSignal.accept(payload);
        }, List.of(Layout.class, Hidden.class, Effect.class));
    }

    private static Consumer<TraversalConsumerPayload>
        getAddSignalConsumer(final Map<Class<?>, ScopedExpression> signals) {
        return payload -> getSignalList(payload.field().propertyWriter()).forEach(addSignal(signals, payload.scope()));
    }

    private static List<Signal> getSignalList(final PropertyWriter field) {
        /**
         * This is needed because of the way Jackson handles annotations internally; If a single signal is added, the
         * annotation can only be retrieved by Signal.class If multiple signals are added, the annotations can only be
         * retrieved by Signals.class
         */
        var singleSignal = field.getAnnotation(Signal.class);

        if (singleSignal != null) {
            return List.of(singleSignal);
        }

        var multipleSignals = field.getAnnotation(Signals.class);

        if (multipleSignals != null) {
            return List.of(multipleSignals.value());
        }

        return List.of();
    }

    private static Consumer<? super Signal> addSignal(final Map<Class<?>, ScopedExpression> signals,
        final String scope) {
        return signal -> {
            final var conditionClass = signal.condition();
            final var condition = InstantiationUtil.createInstance(conditionClass);
            final var scopedSignal = new ScopedExpression(scope, condition);
            final var signalId = signal.id();
            signals.put(signalId.equals(Class.class) ? conditionClass : signalId, scopedSignal);
        };
    }

    private static Consumer<TraversalConsumerPayload> getAddFieldConsumer(final Collection<JsonFormsControl> fields,
        final Map<Class<?>, List<JsonFormsControl>> layoutControls) {
        return payload -> writePayloadToFieldsAndControls(fields, layoutControls, payload);
    }

    private static void writePayloadToFieldsAndControls(final Collection<JsonFormsControl> fields,
        final Map<Class<?>, List<JsonFormsControl>> layoutControls, final TraversalConsumerPayload payload) {
        final var trackedAnnotations = payload.field().trackedAnnotations();
        if (trackedAnnotations.getInstance(Hidden.class).isPresent()) {
            return;
        }
        final var layout = trackedAnnotations.getInstance(Layout.class).map(Layout::value).orElse(null);
        final var effect = trackedAnnotations.getInstance(Effect.class).orElse(null);
        final var newJsonFormsControl = new JsonFormsControl(payload.scope(), payload.field().propertyWriter(),
            payload.rootClass(), new TrackedAnnotations(effect));
        fields.add(newJsonFormsControl);
        layoutControls.compute(layout, (k, previous) -> {
            final var newControls = previous == null ? new ArrayList<JsonFormsControl>() : previous;
            newControls.add(newJsonFormsControl);
            return newControls;
        });
    }

    private static String toScope(final List<String> path, final String settingsKey) {
        final var pathWithPrefix = new ArrayList<String>(path);
        if (settingsKey != null) {
            pathWithPrefix.add(0, settingsKey);
        }
        pathWithPrefix.add(0, "#");
        return toScope(pathWithPrefix);
    }

    static String toScope(final List<String> path) {
        return String.join("/properties/", path);
    }
}
