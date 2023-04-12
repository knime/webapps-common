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
 *   Apr 12, 2023 (benjamin): created
 */
package org.knime.core.webui.node.dialog.ui;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

/**
 * An annotation for a layout part to ensure that the annotated element appears <b>after</b> the referenced layout part.
 * <p>
 * Example:
 *
 * <pre>
 * interface MyLayout {
 *
 *     &#64;Section(title = "Section 1")
 *     &#64;After(Section2.class) // "Section 1" will be displayed after "Section 2"
 *     interface Section1 {
 *     }
 *
 *     &#64;Section(title = "Section 2")
 *     interface Section2 {
 *     }
 * }
 * </pre>
 *
 * This can also be used to target classes which do not have the same enclosing class and with that enables to combine
 * two layouts. Note that in this case the enclosing class of the annotated interface will not be excluded from the
 * layout.
 *
 * <p>
 * Example:
 *
 * <pre>
 * interface MyLayout {
 *
 *     &#64;Section(title = "My Section")
 *     &#64;After(CommonLayout.CommonSection.class) // "My Section" will be displayed after "Common Section"
 *     interface MySection {
 *     }
 * }
 *
 * interface CommonLayout {
 *     &#64;Section(title = "Common Section")
 *     interface CommonSection {
 *     }
 * }
 * </pre>
 * </p>
 *
 * @author Benjamin Wilhelm, KNIME GmbH, Konstanz, Germany
 * @author Paul Bärnreuther
 * @see Before
 */
@Retention(RUNTIME)
@Repeatable(AfterAllOf.class)
@Target(TYPE)
public @interface After {

    /**
     * @return the layout part that must be before the annotated layout part
     */
    Class<?> value();
}
