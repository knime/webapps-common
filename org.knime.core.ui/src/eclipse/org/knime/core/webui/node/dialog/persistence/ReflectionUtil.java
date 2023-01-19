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
 *   Jan 19, 2023 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.persistence;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * Contains utility functions for dealing with reflection.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
public final class ReflectionUtil {

    private ReflectionUtil() {

    }

    /**
     * Creates an instance of the provided class by calling the constructor that has the provided parameters.
     *
     * @param <T> type to instantiate
     * @param clazz class to instantiate
     * @param parameters the parameters of the constructor to call
     * @return an Optional of the clazz if there is a constructor with the provided parameters or
     *         {@link Optional#empty()} if no such constructor exists
     */
    public static <T> Optional<T> createInstance(final Class<T> clazz, final Object... parameters) {
        return getConstructor(clazz, Stream.of(parameters).map(Object::getClass).toArray(Class<?>[]::new))//
            .map(c -> createInstance(c, parameters));
    }

    static <T> T createInstance(final Constructor<T> constructor, final Object... initArgs) {
        constructor.setAccessible(true); // NOSONAR
        try {
            return constructor.newInstance(initArgs);
        } catch (IllegalAccessException ex) {
            // not reachable because we use black-magic to ensure accessibility
            throw new IllegalStateException(
                String.format("Can't access the constructor of '%s'.", constructor.getDeclaringClass()), ex);
        } catch (InstantiationException ex) {
            throw new IllegalStateException(
                String.format("Can't instantiate object of abstract class '%s'.", constructor.getDeclaringClass()), ex);
        } catch (InvocationTargetException ex) {
            throw new IllegalStateException(
                String.format("The empty constructor of '%s' raised an exception.", constructor.getDeclaringClass()),
                ex);
        }
    }

    static <T> Optional<Constructor<T>> getConstructor(final Class<T> clazz, final Class<?>... parameterTypes) {
        try {
            return Optional.of(clazz.getDeclaredConstructor(parameterTypes));
        } catch (NoSuchMethodException ex) {
            return Optional.empty();
        }
    }
}
