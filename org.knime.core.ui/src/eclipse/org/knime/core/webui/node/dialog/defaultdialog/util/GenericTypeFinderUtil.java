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
 *   Jun 21, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.util;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;

import org.apache.commons.math3.exception.OutOfRangeException;

/**
 *
 * @author Paul Bärnreuther
 */
public class GenericTypeFinderUtil {

    private GenericTypeFinderUtil() {
        // Utility class
    }

    /**
     * @param clazz
     * @param genericSuperInterface the interface of clazz from which to take the generic types from
     * @param index the index of the generic type
     * @return the class of the index'th generic type of clazz with respect to the super interface
     */
    public static Class<?> getNthGenericType(final Class<?> clazz, final Class<?> genericSuperInterface,
        final int index) {

        final var genericTypes = getGenericTypes(clazz, genericSuperInterface);
        if (index < 0 || index + 1 > genericTypes.length) {
            throw new OutOfRangeException(index, 0, genericTypes.length);
        }
        return (Class<?>)genericTypes[index];
    }

    private static Type[] getGenericTypes(final Class<?> clazz, final Class<?> genericSuperInterface) {
        if (clazz == null) {
            return new Type[0];
        }
        Type[] interfaces = clazz.getGenericInterfaces();
        for (Type inter : interfaces) {
            final var paramType = (ParameterizedType)inter;
            final var rawType = paramType.getRawType();
            if (genericSuperInterface.isAssignableFrom((Class<?>)rawType)) {
                return paramType.getActualTypeArguments();
            }
        }
        return getGenericTypesViaSuperclass(clazz, genericSuperInterface);
    }

    private static Type[] getGenericTypesViaSuperclass(final Class<?> clazz, final Class<?> genericSuperInterface) {
        final var superClass = clazz.getSuperclass();
        final var superClassResult = getGenericTypes(superClass, genericSuperInterface);

        final var genericSuperClass = clazz.getGenericSuperclass();
        if (genericSuperClass instanceof ParameterizedType pt) {
            return replaceByActualType(superClass, superClassResult, pt);
        }
        return superClassResult;
    }

    /**
     * Since in case of an (intermediate) generic superclass, the method getGenericTypes only returns the types with
     * respect to the general genericSuperInterface from the perspective of the superclass (i.e. with the generic types
     * as received from superClass.getTypeParameters() and not the actual ones), we need to replace those afterwards.
     */
    private static Type[] replaceByActualType(final Class<?> superClass, final Type[] superClassResult,
        final ParameterizedType genericSuperclass) {
        final var actualGenericTypesOfSuperClass = genericSuperclass.getActualTypeArguments();
        final var typeParamsOfSuperClass = Arrays.asList(superClass.getTypeParameters());
        return Arrays.asList(superClassResult).stream().map(t -> {
            final var index = typeParamsOfSuperClass.indexOf(t);
            if (index == -1) {
                return t;
            } else {
                return actualGenericTypesOfSuperClass[index];
            }
        }).toArray(Type[]::new);
    }
}
