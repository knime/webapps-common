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
 *   Mar 22, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.OPTIONS_IS_ADVANCED;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_ACTION_HANDLER;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_ARRAY_LAYOUT_ADD_BUTTON_TEXT;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_ARRAY_LAYOUT_DETAIL;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_ARRAY_LAYOUT_ELEMENT_TITLE;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_ARRAY_LAYOUT_SHOW_SORT_BUTTONS;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_CHOICES_UPDATE_HANDLER;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_DEPENDENCIES;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_ELEMENTS;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_FORMAT;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_LABEL;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_OPTIONS;
import static org.knime.core.webui.node.dialog.defaultdialog.widget.util.WidgetImplementationUtil.getApplicableDefaults;
import static org.knime.core.webui.node.dialog.defaultdialog.widget.util.WidgetImplementationUtil.partitionWidgetAnnotationsByApplicability;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Callable;
import java.util.function.Consumer;
import java.util.stream.Stream;

import org.knime.core.util.Pair;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.Format;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.UiSchemaDefaultNodeSettingsTraverser.JsonFormsControl;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter.ColumnFilter;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.ColumnSelection;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser.TraversedField;
import org.knime.core.webui.node.dialog.defaultdialog.util.GenericTypeFinderUtil;
import org.knime.core.webui.node.dialog.defaultdialog.util.InstantiationUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ArrayWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.AsyncChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ComboBoxWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.DateTimeWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.DateWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LocalFileChooserWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.RadioButtonsWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.RichTextInputWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ValueSwitchWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonActionHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonState;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.NoopButtonUpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.AsyncChoicesAdder;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.NoopChoicesUpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.PersistentAsyncChoicesAdder;
import org.knime.core.webui.node.dialog.defaultdialog.widget.credentials.CredentialsWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.credentials.PasswordWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.credentials.UsernameWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.DeclaringDefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.DependencyHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.util.WidgetImplementationUtil.WidgetAnnotation;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 *
 * @author Paul Bärnreuther
 */
final class UiSchemaOptionsGenerator {

    private final PropertyWriter m_field;

    private final Class<?> m_fieldClass;

    private final String m_fieldName;

    private final ObjectMapper m_mapper;

    private final JavaType m_fieldType;

    private final DefaultNodeSettingsContext m_defaultNodeSettingsContext;

    private final Collection<JsonFormsControl> m_fields;

    private final String m_scope;

    private final AsyncChoicesAdder m_asyncChoicesAdder;

    private static final int ASYNC_CHOICES_THRESHOLD = 100;

    /**
     *
     * @param mapper the object mapper used for the ui schema generation
     * @param field the field for which options are to be added from {@link Style} annotations
     * @param context the current context of the default node settings
     * @param fields all traversed fields
     * @param scope of the current field
     * @param asyncChoicesProvider to be used to store results of asynchronously computed choices of
     *            {@link ChoicesWidget}s.
     */
    UiSchemaOptionsGenerator(final ObjectMapper mapper, final PropertyWriter field,
        final DefaultNodeSettingsContext context, final Collection<JsonFormsControl> fields, final String scope,
        final AsyncChoicesAdder asyncChoicesAdder) {
        m_mapper = mapper;
        m_field = field;
        m_asyncChoicesAdder = asyncChoicesAdder;
        m_fieldType = field.getType();
        m_fieldClass = field.getType().getRawClass();
        m_fieldName = field.getName();
        m_defaultNodeSettingsContext = context;
        m_fields = fields;
        m_scope = scope;
    }

    /**
     * This method applies the styles of the given field to the given control as described in {@link Style}.
     *
     * @param control
     */
    void addOptionsTo(final ObjectNode control) {
        final var defaultWidgets = getApplicableDefaults(m_fieldClass);
        final var annotatedWidgets = getAnnotatedWidgets();
        final var isArrayOfObjects =
            (m_fieldType.isArrayType() || m_fieldType.isCollectionLikeType()) && isObject(m_fieldType.getContentType());
        if (defaultWidgets.isEmpty() && annotatedWidgets.isEmpty() && !isArrayOfObjects) {
            return;
        }
        final var options = control.putObject(TAG_OPTIONS);

        for (var defaultWidget : defaultWidgets) {
            switch (defaultWidget.type()) {
                case CHECKBOX:
                    options.put(TAG_FORMAT, Format.CHECKBOX);
                    break;
                case COLUMN_FILTER:
                    options.put(TAG_FORMAT, Format.COLUMN_FILTER);
                    break;
                case COLUMN_SELECTION:
                    options.put(TAG_FORMAT, Format.COLUMN_SELECTION);
                    break;
                case LOCAL_DATE:
                    options.put(TAG_FORMAT, Format.DATE_TIME);
                    disableTimeFields(options);
                    break;
                case STRING_ARRAY:
                    options.put(TAG_FORMAT, Format.COMBO_BOX);
                    break;
                case CREDENTIALS:
                    options.put(TAG_FORMAT, Format.CREDENTIALS);
                    break;
            }
        }

        if (annotatedWidgets.contains(Widget.class)) {
            final var widget = m_field.getAnnotation(Widget.class);
            if (widget.advanced()) {
                options.put(OPTIONS_IS_ADVANCED, true);
            }
            if (widget.hideTitle()) {
                control.put(TAG_LABEL, "");
            }
        }

        if (annotatedWidgets.contains(DateTimeWidget.class)) {
            final var dateTimeWidget = m_field.getAnnotation(DateTimeWidget.class);
            options.put(TAG_FORMAT, Format.DATE_TIME);
            selectTimeFields(options, dateTimeWidget.showTime(), dateTimeWidget.showSeconds(),
                dateTimeWidget.showMilliseconds());
            if (!dateTimeWidget.timezone().isEmpty()) {
                options.put("timezone", dateTimeWidget.timezone());
            }
            setMinAndMaxDate(options, dateTimeWidget.minDate(), dateTimeWidget.maxDate());
        }

        if (annotatedWidgets.contains(DateWidget.class)) {
            final var dateWidget = m_field.getAnnotation(DateWidget.class);
            setMinAndMaxDate(options, dateWidget.minDate(), dateWidget.maxDate());
        }

        if (annotatedWidgets.contains(RichTextInputWidget.class)) {
            options.put(TAG_FORMAT, Format.RICH_TEXT_INPUT);
        }

        if (annotatedWidgets.contains(LocalFileChooserWidget.class)) {
            options.put(TAG_FORMAT, Format.LOCAL_FILE_CHOOSER);
            final var localFileChooserWidget = m_field.getAnnotation(LocalFileChooserWidget.class);
            options.put("placeholder", localFileChooserWidget.placeholder());
        }
        if (annotatedWidgets.contains(ButtonWidget.class)) {
            final var buttonWidget = m_field.getAnnotation(ButtonWidget.class);
            final var handler = buttonWidget.actionHandler();
            options.put(TAG_ACTION_HANDLER, handler.getName());
            options.put(TAG_FORMAT, Format.BUTTON);

            final var states = options.putArray("states");
            final var handlerInstance = InstantiationUtil.createInstance(handler);
            generateStates(states, handlerInstance);
            options.put("displayErrorMessage", buttonWidget.displayErrorMessage());
            options.put("showTitleAndDescription", buttonWidget.showTitleAndDescription());
            final var dependencies = options.putArray(TAG_DEPENDENCIES);
            addDependencies(dependencies, buttonWidget.actionHandler());
            final var updateHandlerClass = buttonWidget.updateHandler();
            if (updateHandlerClass != NoopButtonUpdateHandler.class) {
                final var updateOptions = options.putObject("updateOptions");
                updateOptions.put("updateHandler", updateHandlerClass.getName());
                final var updateDependencies = updateOptions.putArray(TAG_DEPENDENCIES);
                addDependencies(updateDependencies, updateHandlerClass);
            }
        }

        if (annotatedWidgets.contains(ValueSwitchWidget.class)) {
            options.put(TAG_FORMAT, Format.VALUE_SWITCH);
        }

        if (annotatedWidgets.contains(RadioButtonsWidget.class)) {
            final var radioButtons = m_field.getAnnotation(RadioButtonsWidget.class);
            options.put(TAG_FORMAT, Format.RADIO);
            if (radioButtons.horizontal()) {
                options.put("radioLayout", "horizontal");
            } else {
                options.put("radioLayout", "vertical");
            }
        }

        final var hasCredentialsWidgetAnnotation = annotatedWidgets.contains(CredentialsWidget.class);
        final var hasUsernameWidgetAnnotation = annotatedWidgets.contains(UsernameWidget.class);
        final var hasPasswordWidgetAnnotation = annotatedWidgets.contains(PasswordWidget.class);
        if (Stream.of(hasCredentialsWidgetAnnotation, hasUsernameWidgetAnnotation, hasPasswordWidgetAnnotation)
            .filter(b -> b).count() > 1) {
            throw new UiSchemaGenerationException(
                "@UsernameWidget, @PasswordWidget and @CredentialsWidget should not be used together in one place.");
        }
        if (hasCredentialsWidgetAnnotation) {
            final var credentialsWidget = m_field.getAnnotation(CredentialsWidget.class);
            options.put("usernameLabel", credentialsWidget.usernameLabel());
            options.put("passwordLabel", credentialsWidget.passwordLabel());
            if (credentialsWidget.hasSecondAuthenticationFactor()) {
                options.put("showSecondFactor", true);
                options.put("secondFactorLabel", credentialsWidget.secondFactorLabel());
            }
        }
        if (hasUsernameWidgetAnnotation) {
            final var usernameWidget = m_field.getAnnotation(UsernameWidget.class);
            options.put("hidePassword", true);
            options.put("usernameLabel", usernameWidget.value());

        }
        if (hasPasswordWidgetAnnotation) {
            final var passwordWidget = m_field.getAnnotation(PasswordWidget.class);
            options.put("hideUsername", true);
            options.put("passwordLabel", passwordWidget.passwordLabel());
            if (passwordWidget.hasSecondAuthenticationFactor()) {
                options.put("showSecondFactor", true);
                options.put("secondFactorLabel", passwordWidget.secondFactorLabel());
            }
        }

        if (annotatedWidgets.contains(ChoicesWidget.class)) {
            final var choicesWidget = m_field.getAnnotation(ChoicesWidget.class);
            final var choicesProviderClass = choicesWidget.choices();
            if (AsyncChoicesProvider.class.isAssignableFrom(choicesProviderClass)) {
                prepareAsyncChoices(options, choicesProviderClass, () -> generatePossibleValues(choicesProviderClass));
            } else {
                final var possibleValues = generatePossibleValues(choicesProviderClass);
                if (possibleValues.length < ASYNC_CHOICES_THRESHOLD) {
                    options.set("possibleValues", m_mapper.valueToTree(possibleValues));
                } else {
                    prepareAsyncChoices(options, choicesProviderClass, () -> possibleValues);
                }
            }
            if (!m_fieldClass.equals(ColumnSelection.class) && !m_fieldClass.equals(ColumnFilter.class)) {
                String format = getChoicesComponentFormat();
                options.put(TAG_FORMAT, format);
            }
            options.put("showNoneColumn", choicesWidget.showNoneColumn());
            options.put("showRowKeys", choicesWidget.showRowKeysColumn());
            options.put("showSearch", choicesWidget.showSearch());
            options.put("showMode", choicesWidget.showMode());
            if (!choicesWidget.choicesUpdateHandler().equals(NoopChoicesUpdateHandler.class)) {
                options.put(TAG_CHOICES_UPDATE_HANDLER, choicesWidget.choicesUpdateHandler().getName());
                final var dependencies = options.putArray(TAG_DEPENDENCIES);
                addDependencies(dependencies, choicesWidget.choicesUpdateHandler());
            }
            if (annotatedWidgets.contains(ComboBoxWidget.class)) {
                options.put(TAG_FORMAT, Format.COMBO_BOX);
            }
        }

        if (isArrayOfObjects) {
            applyArrayLayoutOptions(options, m_fieldType.getContentType().getRawClass());
        }
    }

    private void prepareAsyncChoices(final ObjectNode options,
        final Class<? extends ChoicesProvider> choicesProviderClass, final Callable<Object[]> getChoices) {
        String choicesProviderClassName = choicesProviderClass.getName();
        options.put("choicesProviderClass", choicesProviderClassName);
        m_asyncChoicesAdder.addChoices(choicesProviderClassName, getChoices);
    }

    private Object[] generatePossibleValues(final Class<? extends ChoicesProvider> choicesProviderClass) {
        final var choicesProvider = InstantiationUtil.createInstance(choicesProviderClass);
        final var possibleValues = ChoicesGeneratorUtil.getChoices(choicesProvider, m_defaultNodeSettingsContext);
        return possibleValues;
    }

    private static <M extends Enum<M>> void generateStates(final ArrayNode states,
        final ButtonActionHandler<?, ?, M> handler) {
        final var stateMachine = handler.getStateMachine();
        getEnumFields(stateMachine).forEach(pair -> addState(pair.getFirst(), pair.getSecond(), states, handler));
    }

    private static <M extends Enum<M>> List<Pair<Field, M>> getEnumFields(final Class<M> enumClass) {
        return Arrays.asList(enumClass.getFields()).stream().filter(Field::isEnumConstant)
            .map(f -> new Pair<>(f, getEnumConstant(f.getName(), enumClass.getEnumConstants()))).toList();
    }

    private static <M extends Enum<M>> M getEnumConstant(final String fieldName, final M[] enumConstants) {
        return Stream.of(enumConstants).filter(m -> m.name().equals(fieldName)).findFirst().orElseThrow();
    }

    private static <M extends Enum<M>> void addState(final Field field, final M enumConst, final ArrayNode states,
        final ButtonActionHandler<?, ?, M> handler) {
        final var state = states.addObject();
        state.put("id", field.getName());
        var buttonState = field.getAnnotation(ButtonState.class);
        buttonState = handler.overrideButtonState(enumConst, buttonState);
        state.put("disabled", buttonState.disabled());
        state.put("primary", buttonState.primary());
        final var nextState = buttonState.nextState();
        if (!nextState.isEmpty()) {
            state.put("nextState", nextState);
        }
        state.put("text", buttonState.text());
    }

    private static void disableTimeFields(final ObjectNode options) {
        selectTimeFields(options, false, false, false);
    }

    private static void selectTimeFields(final ObjectNode options, final boolean showTime, final boolean showSeconds,
        final boolean showMilliseconds) {
        options.put("showTime", showTime);
        options.put("showSeconds", showSeconds);
        options.put("showMilliseconds", showMilliseconds);
    }

    private static void setMinAndMaxDate(final ObjectNode options, final String minDate, final String maxDate) {
        if (!minDate.isEmpty()) {
            options.put("minimum", minDate);
        }
        if (!maxDate.isEmpty()) {
            options.put("maximum", maxDate);
        }
    }

    private void addDependencies(final ArrayNode dependencies,
        final Class<? extends DependencyHandler<?>> actionHandler) {
        final var dependencyClass = GenericTypeFinderUtil.getFirstGenericType(actionHandler, DependencyHandler.class);
        final var traverser = new DefaultNodeSettingsFieldTraverser(m_mapper, dependencyClass);
        final Consumer<TraversedField> addNewDependency = getAddNewDependencyCallback(dependencies);
        traverser.traverse(addNewDependency, List.of(DeclaringDefaultNodeSettings.class));
    }

    private Consumer<TraversedField> getAddNewDependencyCallback(final ArrayNode dependencies) {
        return field -> {
            final var searchScope = UiSchemaDefaultNodeSettingsTraverser.toScope(field.path());
            final var declaringDefaultNodeSettings = field.trackedAnnotations()
                .getInstance(DeclaringDefaultNodeSettings.class).map(DeclaringDefaultNodeSettings::value).orElse(null);
            final var clazz = field.propertyWriter().getType().getRawClass();
            final var targetScope = findTargetScope(searchScope, declaringDefaultNodeSettings, clazz);
            /**
             * exclude the field itself to enable using the current DefaultNodeSettings as the dependencies class to get
             * a dependency from every other setting.
             */
            if (!targetScope.equals(m_scope)) {
                dependencies.add(targetScope);
            }
        };
    }

    private String findTargetScope(final String searchScope,
        final Class<? extends DefaultNodeSettings> declaringDefaultNodeSettings, final Class<?> clazz) {
        final var candidates = m_fields.stream().filter(control -> {
            if (declaringDefaultNodeSettings != null && !control.rootClass().equals(declaringDefaultNodeSettings)) {
                return false;
            }
            boolean classEquals = control.field().getType().getRawClass().equals(clazz);
            boolean matchesSearchPath = control.scope().endsWith(searchScope);
            return classEquals && matchesSearchPath;
        }).map(JsonFormsControl::scope).toList();
        if (candidates.size() > 1) {
            throw new UiSchemaGenerationException(
                String.format("Multiple settings found for path %s. Consider using @DeclaringClass to "
                    + "disambiguate the reference.", searchScope));
        }
        return candidates.stream().findFirst().orElseThrow(
            () -> new UiSchemaGenerationException(String.format("No setting found for path %s.", searchScope)));
    }

    /**
     * Note that for ColumnFilter and ColumnSelection, the format is set as part of the default formats. For String
     * arrays, we use the "twinList" format and otherwise we use "dropDown".
     *
     * @return
     */
    private String getChoicesComponentFormat() {
        String format = Format.DROP_DOWN;
        if (m_fieldType.isArrayType() && m_fieldType.getContentType().getRawClass().equals(String.class)) {
            format = Format.TWIN_LIST;
        }
        return format;
    }

    private Collection<?> getAnnotatedWidgets() {
        final var partitionedWidgetAnnotations = partitionWidgetAnnotationsByApplicability(
            widgetAnnotation -> m_field.getAnnotation(widgetAnnotation) != null, m_fieldClass);

        if (!partitionedWidgetAnnotations.get(false).isEmpty()) {
            throw new UiSchemaGenerationException(
                String.format("The annotation %s is not applicable for setting field %s with type %s",
                    partitionedWidgetAnnotations.get(false).get(0), m_fieldName, m_fieldClass));
        }

        return partitionedWidgetAnnotations.get(true).stream().map(WidgetAnnotation::widgetAnnotation).toList();
    }

    private void applyArrayLayoutOptions(final ObjectNode options, final Class<?> componentType) {

        Map<String, Class<?>> arraySettings = new HashMap<>();
        arraySettings.put(null, componentType);
        /**
         * We need a persistent async choices adder in case of settings nested inside an array layout, since the
         * frontend fetches the choices for every element in it individually and one can add more than initially
         * present.
         */
        final var persistentAsyncChoicesAdder = new PersistentAsyncChoicesAdder(m_asyncChoicesAdder);
        var details = JsonFormsUiSchemaUtil
            .buildUISchema(arraySettings, m_mapper, m_defaultNodeSettingsContext, persistentAsyncChoicesAdder)
            .get(TAG_ELEMENTS);
        options.set(TAG_ARRAY_LAYOUT_DETAIL, details);

        Optional.ofNullable(m_field.getAnnotation(ArrayWidget.class))
            .ifPresent(arrayWidget -> addArrayLayoutOptions(arrayWidget, options));
    }

    private static void addArrayLayoutOptions(final ArrayWidget arrayWidget, final ObjectNode options) {
        var addButtonText = arrayWidget.addButtonText();
        if (!addButtonText.isEmpty()) {
            options.put(TAG_ARRAY_LAYOUT_ADD_BUTTON_TEXT, addButtonText);
        }
        var elementTitle = arrayWidget.elementTitle();
        if (!elementTitle.isEmpty()) {
            options.put(TAG_ARRAY_LAYOUT_ELEMENT_TITLE, elementTitle);
        }
        if (arrayWidget.showSortButtons()) {
            options.put(TAG_ARRAY_LAYOUT_SHOW_SORT_BUTTONS, true);
        }
    }

    /** @return true if the type is from an POJO and not a primitive, String, Boxed type, or enum */
    private static boolean isObject(final JavaType contentType) {
        var boxedTypes = List.of(String.class, Double.class, Short.class, Boolean.class, Float.class, Integer.class,
            Long.class, Character.class);

        return !contentType.isPrimitive() && !contentType.isEnumType()
            && boxedTypes.stream().allMatch(type -> !type.equals(contentType.getRawClass()));
    }
}
