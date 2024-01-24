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
 *   Jan 24, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.dataservice;

import static org.knime.core.webui.node.dialog.defaultdialog.dataservice.ConvertValueUtil.convertDependencies;
import static org.knime.core.webui.node.dialog.defaultdialog.util.InstantiationUtil.createInstance;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.knime.core.node.util.CheckUtils;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.dataservice.ValueUpdateHandlerHolder.PathAndValue;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Update;
import org.knime.core.webui.node.dialog.defaultdialog.util.GenericTypeFinderUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.NoopUpdateResolver;
import org.knime.core.webui.node.dialog.defaultdialog.widget.UpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.UpdateResolver;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.WidgetHandlerException;

/**
 *
 * @author Paul Bärnreuther
 */
public final class ValueUpdateHandlerHolder extends FieldHandlerHolder<UpdateHandler<List<PathAndValue>, ?>> {

    ValueUpdateHandlerHolder(final Map<String, Class<? extends WidgetGroup>> settingsClasses) {
        super(settingsClasses);
    }

    private record FieldAndUpdateAnnotation(FieldWithDefaultNodeSettingsKey field, Update update) {
        boolean updateAnnotationIsPresent() {
            return update != null;
        }
    }

    record PathAndResolver(String path, UpdateResolver<?, ?> instance) {
    }

    record PathAndValue(String path, Object value) {
    }

    @Override
    Map<String, UpdateHandler<List<PathAndValue>, ?>> toHandlers(final List<FieldWithDefaultNodeSettingsKey> fields) {
        final Map<String, UpdateHandler<List<PathAndValue>, ?>> handlers = new HashMap<>();
        final var fieldsWithAnnotation = fields.stream().map(ValueUpdateHandlerHolder::toFieldAndUpdateAnnotation)
            .filter(FieldAndUpdateAnnotation::updateAnnotationIsPresent);
        final var groupedByHandler = groupByHandler(fieldsWithAnnotation);
        groupedByHandler.forEach((handler, fieldsForHandler) -> {
            final var handlerName = handler.getName();
            if (fieldsForHandler.size() == 1) {
                final var field = fieldsForHandler.get(0);
                validateSingleUpdate(field);
                final var handlerInstance = createInstance(handler);
                final var path = toPath(field);
                handlers.put(handlerName, new UpdateHandler<List<PathAndValue>, Object>() {

                    @Override
                    public List<PathAndValue> update(final Object settings, final DefaultNodeSettingsContext context)
                        throws WidgetHandlerException {
                        final var convertedSettings = convertDependencies(settings, handlerInstance, context);
                        final var value = handlerInstance.castAndUpdate(convertedSettings, context);
                        return List.of(new PathAndValue(path, value));
                    }

                });
            } else {
                fieldsForHandler.forEach(ValueUpdateHandlerHolder::validateMultiUpdate);
                final var handlerInstance = createInstance(handler);
                final var resolvers =
                    fieldsForHandler.stream().map(ValueUpdateHandlerHolder::toPathAndResolver).toList();

                handlers.put(handlerName, new UpdateHandler<List<PathAndValue>, Object>() {

                    @Override
                    public List<PathAndValue> update(final Object settings, final DefaultNodeSettingsContext context)
                        throws WidgetHandlerException {
                        final var convertedSettings = convertDependencies(settings, handlerInstance, context);
                        final var intermediateObject = handlerInstance.castAndUpdate(convertedSettings, context);
                        return resolvers.stream().map(resolver -> {
                            final var path = resolver.path();
                            final var value = resolver.instance().castAndUpdate(intermediateObject, context);
                            return new PathAndValue(path, value);
                        }).toList();
                    }

                });
            }
        });

        return handlers;
    }

    /**
     * @param update
     */
    private static void validateSingleUpdate(final FieldAndUpdateAnnotation fieldAndUpdateAnnotation) {
        CheckUtils.check(fieldAndUpdateAnnotation.update().resolver().isAssignableFrom(NoopUpdateResolver.class),
            IllegalStateException::new,
            () -> String.format(
                "Invalid @Update annotation on field %s: There exists other annotation with the same handler, so no custom resolver must be used.", //
                toPath(fieldAndUpdateAnnotation)));

        final var updateHandlerReturnType = getUpdateHandlerReturnType(fieldAndUpdateAnnotation);
        final var fieldType = getFieldType(fieldAndUpdateAnnotation);
        CheckUtils.check(fieldType.isAssignableFrom(updateHandlerReturnType), IllegalStateException::new,
            () -> String.format(
                "Invalid @Update annotation on field %s: The return type of the handler (%s) does not match the field type (%s).", //
                toPath(fieldAndUpdateAnnotation), updateHandlerReturnType.getSimpleName(), fieldType.getSimpleName()));

    }

    private static void validateMultiUpdate(final FieldAndUpdateAnnotation fieldAndUpdateAnnotation) {
        final var updateHandlerReturnType = getUpdateHandlerReturnType(fieldAndUpdateAnnotation);
        final var resolverReturnType = getResolverReturnType(fieldAndUpdateAnnotation);
        final var resolverInputType = getResolverInputType(fieldAndUpdateAnnotation);
        final var fieldType = getFieldType(fieldAndUpdateAnnotation);
        CheckUtils.check(resolverInputType.isAssignableFrom(updateHandlerReturnType), IllegalStateException::new,
            () -> String.format(
                "Invalid @Update annotation on field %s: The input type of the resolver (%s) does not match the return type of the handler (%s).", //
                toPath(fieldAndUpdateAnnotation), resolverInputType.getSimpleName(),
                updateHandlerReturnType.getSimpleName()));
        CheckUtils.check(fieldType.isAssignableFrom(resolverReturnType), IllegalStateException::new,
            () -> String.format(
                "Invalid @Update annotation on field %s: The return type of the resolver (%s) does not match the return type of the resolver (%s).", //
                toPath(fieldAndUpdateAnnotation), fieldType.getSimpleName(), resolverReturnType.getSimpleName()));
    }

    private static Class<?> getUpdateHandlerReturnType(final FieldAndUpdateAnnotation fieldAndUpdateAnnotation) {
        final var handlerClass = fieldAndUpdateAnnotation.update().updateHandler();
        return GenericTypeFinderUtil.getFirstGenericType(handlerClass, UpdateHandler.class);
    }

    private static Class<?> getResolverReturnType(final FieldAndUpdateAnnotation fieldAndUpdateAnnotation) {
        final var resolverClass = fieldAndUpdateAnnotation.update().resolver();
        return GenericTypeFinderUtil.getNthGenericType(resolverClass, UpdateResolver.class, 1);
    }

    private static Class<?> getResolverInputType(final FieldAndUpdateAnnotation fieldAndUpdateAnnotation) {
        final var handlerClass = fieldAndUpdateAnnotation.update().resolver();
        return GenericTypeFinderUtil.getFirstGenericType(handlerClass, UpdateResolver.class);
    }

    private static Class<?> getFieldType(final FieldAndUpdateAnnotation fieldAndUpdateAnnotation) {
        return fieldAndUpdateAnnotation.field().field().propertyWriter().getType().getRawClass();
    }

    private static Map<Class<? extends UpdateHandler<?, ?>>, List<FieldAndUpdateAnnotation>>
        groupByHandler(final Stream<FieldAndUpdateAnnotation> fieldsWithAnnotation) {
        return fieldsWithAnnotation
            .collect(Collectors.<FieldAndUpdateAnnotation, Class<? extends UpdateHandler<?, ?>>> groupingBy(
                field -> field.update.updateHandler()));
    }

    private static FieldAndUpdateAnnotation toFieldAndUpdateAnnotation(final FieldWithDefaultNodeSettingsKey field) {
        return new FieldAndUpdateAnnotation(field, getAnnotation(field));
    }

    private static Update getAnnotation(final FieldWithDefaultNodeSettingsKey field) {
        return field.field().propertyWriter().getAnnotation(Update.class);
    }

    private static PathAndResolver toPathAndResolver(final FieldAndUpdateAnnotation field) {
        final var resolverInstance = createInstance(field.update().resolver());

        return new PathAndResolver(toPath(field), resolverInstance);
    }

    private static String toPath(final FieldAndUpdateAnnotation field) {
        final var settingsKey = field.field().settingsKey();
        final var path = field.field().field().path();
        return settingsKey + "." + String.join(".", path);
    }

}
