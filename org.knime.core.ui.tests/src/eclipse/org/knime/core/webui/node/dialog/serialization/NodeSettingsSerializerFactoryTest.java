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
 *   Dec 6, 2022 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.serialization;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Objects;

import org.apache.commons.lang3.NotImplementedException;
import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.impl.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.serialization.field.FieldBasedNodeSettingsSerializer;

/**
 * Contains tests for {@link NodeSettingsSerializerFactory}.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
public class NodeSettingsSerializerFactoryTest {

    @Test
    void testFieldBasedSerialization() throws InvalidSettingsException {
        var settings = new FieldBasedSerializerSettings();
        settings.m_foo = "foo";
        testSaveLoad(settings);
    }

    @Test
    void testCustomSerialization() throws InvalidSettingsException {
        var settings = new CustomSerializerSettings();
        settings.m_foo = "bar";
        testSaveLoad(settings);
    }

    @Test
    void testFallbackSerialization() throws InvalidSettingsException {
        var settings = new FallbackSerializerSettings();
        settings.m_foo = "baz";
        testSaveLoad(settings);
    }

    @Test
    void testInvalidCustomSerializer() {
        assertThrows(IllegalArgumentException.class,
            () -> NodeSettingsSerializerFactory.createSerializer(InvalidCustomSerializerSettings.class));
    }

    private static <S extends DefaultNodeSettings> void testSaveLoad(final S settings) throws InvalidSettingsException {
        @SuppressWarnings("unchecked")
        var settingsClass = (Class<S>)settings.getClass();
        var serializer = NodeSettingsSerializerFactory.createSerializer(settingsClass);
        var nodeSettings = new NodeSettings("test");
        serializer.save(settings, nodeSettings);
        var loaded = serializer.load(nodeSettings);
        assertFalse(loaded == settings);
        assertEquals(settings, loaded);
    }

    @Serialization(serializer = FieldBasedNodeSettingsSerializer.class)
    private static final class FieldBasedSerializerSettings extends AbstractTestSettings<FieldBasedSerializerSettings> {
        String m_foo;

        @Override
        protected boolean internalEquals(final FieldBasedSerializerSettings other) {
            return Objects.equals(m_foo, other.m_foo);
        }
    }

    private abstract static class AbstractTestSettings<S extends AbstractTestSettings<S>>
        implements DefaultNodeSettings {

        @Override
        public final boolean equals(final Object obj) {
            if (obj == this) {
                return true;
            } else if (obj == null) {
                return false;
            } else if (getClass().equals(obj.getClass())) {
                return internalEquals((S)obj);
            } else {
                return false;
            }
        }

        protected abstract boolean internalEquals(final S other);
    }

    @Serialization(serializer = CustomSerializer.class)
    private static final class CustomSerializerSettings extends AbstractTestSettings<CustomSerializerSettings> {
        String m_foo;

        @Override
        protected boolean internalEquals(final CustomSerializerSettings other) {
            return Objects.equals(m_foo, other.m_foo);
        }

    }

    private static final class CustomSerializer implements CustomNodeSettingsSerializer<CustomSerializerSettings> {

        @Override
        public void save(final CustomSerializerSettings obj, final NodeSettingsWO settings) {
            settings.addString("custom_foo", obj.m_foo);
        }

        @Override
        public CustomSerializerSettings load(final NodeSettingsRO settings)
            throws InvalidSettingsException {
            var obj = new CustomSerializerSettings();
            obj.m_foo = settings.getString("custom_foo");
            return obj;
        }
    }

    private static final class FallbackSerializerSettings extends AbstractTestSettings<FallbackSerializerSettings> {

        String m_foo;

        @Override
        protected boolean internalEquals(final FallbackSerializerSettings other) {
            return Objects.equals(m_foo, other.m_foo);
        }
    }

    private static final class InvalidCustomSerializer
        implements NodeSettingsSerializer<InvalidCustomSerializerSettings> {

        @Override
        public InvalidCustomSerializerSettings load(final NodeSettingsRO settings)
            throws InvalidSettingsException {
            throw new NotImplementedException("This class should not be instantiated by the test.");
        }

        @Override
        public void save(final InvalidCustomSerializerSettings obj, final NodeSettingsWO settings) {
            throw new NotImplementedException("This class should not be instantiated by the test.");
        }

    }

    @Serialization(serializer = InvalidCustomSerializer.class)
    private static final class InvalidCustomSerializerSettings implements DefaultNodeSettings {
    }
}
