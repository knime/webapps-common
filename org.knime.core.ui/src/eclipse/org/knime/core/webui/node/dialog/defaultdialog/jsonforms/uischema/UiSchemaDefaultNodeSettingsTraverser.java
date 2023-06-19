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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.rule.JsonFormsExpression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Signal;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Signals;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser.Field;
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

    static record JsonFormsControl(String scope, PropertyWriter field) {
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
        Map<Class<?>, JsonFormsExpression> signals) {
    }

    TraversalResult traverse(final Map<String, Class<?>> settings) {
        final Map<Class<?>, List<JsonFormsControl>> layoutPartToControls = new HashMap<>();
        final Map<Class<?>, JsonFormsExpression> signals = new HashMap<>();
        final var addLayout = getAddLayoutConsumer(layoutPartToControls);
        final var addSignal = getAddSignalConsumer(signals);
        settings.forEach((settingsKey, setting) -> traverseSettingsClass(addLayout, addSignal, settingsKey, setting));
        return new TraversalResult(layoutPartToControls, signals);
    }

    private void traverseSettingsClass(final BiConsumer<Field, String> addLayout,
        final BiConsumer<Field, String> addSignal, final String settingsKey, final Class<?> setting) {
        final var traverser = new DefaultNodeSettingsFieldTraverser(m_mapper, setting);
        traverser.traverse(field -> {
            if (field.trackedAnnotations().getInstance(Hidden.class).isPresent()) {
                return;
            }
            final var scope = toScope(field.path(), settingsKey);
            addLayout.accept(field, scope);
            addSignal.accept(field, scope);
        }, List.of(Layout.class, Hidden.class));
    }

    private static BiConsumer<Field, String> getAddSignalConsumer(final Map<Class<?>, JsonFormsExpression> signals) {
        return (field, scope) -> getSignalList(field.propertyWriter()).forEach(addSignal(signals, scope));
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

    private static Consumer<? super Signal> addSignal(final Map<Class<?>, JsonFormsExpression> signals,
        final String scope) {
        return signal -> {
            final var conditionClass = signal.condition();
            final var condition = InstantiationUtil.createInstance(conditionClass);
            final var scopedSignal = new JsonFormsExpression(scope, condition);
            final var signalId = signal.id();
            signals.put(signalId.equals(Class.class) ? conditionClass : signalId, scopedSignal);
        };
    }

    private static BiConsumer<Field, String>
        getAddLayoutConsumer(final Map<Class<?>, List<JsonFormsControl>> layoutControls) {
        return (field, scope) -> {
            final var layout = field.trackedAnnotations().getInstance(Layout.class).map(Layout::value).orElse(null);
            layoutControls.compute(layout, (k, previous) -> {
                final var newControls = previous == null ? new ArrayList<JsonFormsControl>() : previous;
                newControls.add(new JsonFormsControl(scope, field.propertyWriter()));
                return newControls;
            });
        };
    }

    private static String toScope(final List<String> path, final String settingsKey) {
        final var pathWithPrefix = new ArrayList<String>(path);
        if (settingsKey != null) {
            pathWithPrefix.add(0, settingsKey);
        }
        pathWithPrefix.add(0, "#");
        return String.join("/properties/", pathWithPrefix);
    }
}
