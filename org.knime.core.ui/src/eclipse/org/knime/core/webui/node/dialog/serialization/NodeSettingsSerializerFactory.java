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
 *   Dec 2, 2022 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.serialization;

import org.knime.core.webui.node.dialog.impl.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.serialization.field.FieldBasedNodeSettingsSerializer;

/**
 * Creates NodeSettingsSerializers for DefaultNodeSettings.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 * @noreference non-public API
 */
public final class NodeSettingsSerializerFactory {

    private NodeSettingsSerializerFactory() {

    }

    /**
     * Creates the {@link NodeSettingsSerializer serializer} for a {@link DefaultNodeSettings settings} class. <br>
     * <br>
     * If the {@link DefaultNodeSettings settings} are annotated with a {@link Serialization}, then an instance of the
     * {@link Serialization#serializer()} is created.<br>
     * Otherwise the existing reflection based serialization is used for backwards compatibility.
     *
     * @param <S> the type of {@link DefaultNodeSettings} the serializer is for
     * @param settingsClass the class of {@link DefaultNodeSettings} to create a serializer for
     * @return the serializer for the provided settingsClass
     * @throws IllegalArgumentException if the provided class references an unsupported serializer (e.g. a custom
     *             serializer that extends NodeSettingsSerializer directly)
     */
    public static <S extends DefaultNodeSettings> NodeSettingsSerializer<S>
        createSerializer(final Class<S> settingsClass) {
        var serialization = settingsClass.getAnnotation(Serialization.class);
        if (serialization == null) {
            // no annotation means we use the old serialization
            return new ReflectionDefaultNodeSettingsSerializer<>(settingsClass);
        } else {
            var serializerClass = serialization.serializer();
            if (FieldBasedNodeSettingsSerializer.class.equals(serializerClass)) {
                return new FieldBasedNodeSettingsSerializer<>(settingsClass);
            } else if (CustomNodeSettingsSerializer.class.isAssignableFrom(serializerClass)) {
                @SuppressWarnings("unchecked")
                var customSerializer = CustomNodeSettingsSerializer
                    .createInstance((Class<? extends CustomNodeSettingsSerializer<S>>)serializerClass);
                return customSerializer;
            } else {
                throw new IllegalArgumentException(String
                    .format("The DefaultNodeSettings class '%s' does not specify a valid serializer.", settingsClass));
            }
        }
    }
}
