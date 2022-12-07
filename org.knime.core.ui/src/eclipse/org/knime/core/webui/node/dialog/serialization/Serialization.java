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

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import org.knime.core.webui.node.dialog.serialization.field.FieldBasedNodeSettingsSerializer;
import org.knime.core.webui.node.dialog.serialization.field.FieldSerialization;

/**
 * Annotates a class with a serializer that is used to save and load objects of the class to and from NodeSettings. If
 * no serialization is provided, we fall back to the previous JSON based serialization. For most use-cases
 * {@link FieldBasedNodeSettingsSerializer} is a good choice. It performs serialization of all fields independently and
 * allows further customization on a per field basis via the {@link FieldSerialization} annotation. <br>
 * <br>
 * If you find the FieldBasedNodeSettingsSerializer to be insufficient for your needs, you can also implement your own
 * {@link CustomNodeSettingsSerializer} and provide it here.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 * @noreference non-public API
 */
@Retention(RUNTIME)
@Target(TYPE)
public @interface Serialization {

    /**
     * The type of serializer to use for storing and loading the annotated object to and from NodeSettings. Either
     * {@link FieldBasedNodeSettingsSerializer} or your own implementation of {@link CustomNodeSettingsSerializer}. If
     * you want to use the previous JSON based serialization simply provide no Serialization at all.
     *
     * @return the class of the serializer
     */
    @SuppressWarnings("rawtypes") // even wildcards prohibit generic serializers from being returned
    Class<? extends NodeSettingsSerializer> serializer();

}
