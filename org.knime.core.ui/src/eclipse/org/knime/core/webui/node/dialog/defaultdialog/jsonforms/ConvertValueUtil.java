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
 *   Jan 25, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms;

import java.lang.reflect.Type;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.PasswordHolder;
import org.knime.core.webui.node.dialog.defaultdialog.util.GenericTypeFinderUtil;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.ValueAndTypeReference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.DependencyHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Reference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider.TypeReference;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * A utility class for converting untyped objects to resolved objects of the correct type by using
 * {@link ObjectMapper#convertValue}.
 *
 * @author Paul Bärnreuther
 */
public final class ConvertValueUtil {

    private ConvertValueUtil() {
        // Utility
    }

    /**
     * @param objectSettings
     * @param valueAndTypeRef
     * @param context
     * @return an object of the generic type of the {@link Reference}
     */
    public static Object convertValueRef(final Object objectSettings, final ValueAndTypeReference valueAndTypeRef,
        final DefaultNodeSettingsContext context) {
        final var settingsType = getSettingsType(valueAndTypeRef);
        return convertValue(objectSettings, settingsType, context);
    }

    private static Type getSettingsType(final ValueAndTypeReference valueAndTypeRef) {
        final var valueRef = valueAndTypeRef.getValueRef();
        final var typeRef = valueAndTypeRef.getTypeReference();
        return typeRef == null ? getSettingsType(valueRef) : getSettingsType(typeRef);
    }

    private static Type getSettingsType(final Class<? extends Reference> valueRef) {
        return GenericTypeFinderUtil.getFirstGenericType(valueRef, Reference.class);
    }

    private static Type getSettingsType(final TypeReference typeRef) {
        return GenericTypeFinderUtil.getFirstGenericType(typeRef.getClass(), TypeReference.class);
    }

    /**
     *
     * @param objectSettings
     * @param handler
     * @param context
     * @return an object of the generic type of the {@link DependencyHandler}
     */
    public static Object convertDependencies(final Object objectSettings, final DependencyHandler<?> handler,
        final DefaultNodeSettingsContext context) {
        final var settingsType = GenericTypeFinderUtil.getFirstGenericType(handler.getClass(), DependencyHandler.class);
        return convertValue(objectSettings, settingsType, context);
    }

    /**
     * @param objectSettings
     * @param settingsType
     * @param context
     * @return an object of the given settings type
     */
    public static <T> T convertValue(final Object objectSettings, final Type settingsType,
        final DefaultNodeSettingsContext context) {
        PasswordHolder.setCredentialsProvider(context == null ? null : context.getCredentialsProvider().orElse(null));
        final var mapper = JsonFormsDataUtil.getMapper();
        try {
            return mapper.convertValue(objectSettings, mapper.constructType(settingsType));
        } finally {
            PasswordHolder.removeCredentialsProvider();
        }

    }
}
