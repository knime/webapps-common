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
 *   Feb 6, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.updates;

import java.util.function.Supplier;

import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.SimpleButtonWidget;

/**
 * This class is used to provide dynamic state for value or metadata of dialog controls. It can also provide an
 * intermediate non-user-facing state to be used in the computation of other {@link StateProvider}s.
 * <ul>
 * It consists of two methods:
 * <li>With {@link #init} the dependencies and triggers are defined. This method is called whenever the dialog is opened
 * and before every invocation of {@link #computeState}.</li>
 * <li>{@link #computeState} is called whenever one of the defined actions defined in {@link #init} triggers.</li>
 * </ul>
 *
 * @author Paul Bärnreuther
 * @param <S> The type of the provided state
 */
public interface StateProvider<S> {

    /**
     * This interface defined the methods with which the state provider can be configured. One can define
     * <ul>
     * <li><b>Triggers</b>: The user actions leading to an invocation</li>
     * <li><b>Dependencies</b>: The fields on whose values the provided state depends on.</li>
     * </ul>
     */
    interface StateProviderInitializer {

        /**
         * Sets value ref as <b>Trigger</b> and as <b>Dependency</b>, i.e.:
         *
         * Refer to a {@link Widget} with this method to recompute the provided state on every change of that setting
         * while also depending on the new value.
         *
         * @param <T> the type of the dependency
         * @param ref used for {@link Widget#ref} of a field
         * @return a supplier to be used during {@link #computeState}. If the returned supplier is not needed, use
         *         {@link #computeOnValueChange} instead.
         */
        <T> Supplier<T> computeFromValueSupplier(Class<? extends ValueRef<T>> ref);

        /**
         * Sets value ref as <b>Dependency</b> and not as <b>Trigger</b>, i.e.:
         *
         * Refer to a {@link Widget} with this method to depend on its value without triggering recomputation on a
         * change of it.
         *
         * @param <T> the type of the dependency
         * @param ref used for {@link Widget#ref} of a field
         * @return a supplier to be used during {@link #computeState}.
         */
        <T> Supplier<T> getValueSupplier(Class<? extends ValueRef<T>> ref);

        /**
         * Sets value ref as <b>Trigger</b> and not as <b>Dependency</b>, i.e.:
         *
         * Refer to a {@link Widget} with this method to recompute the provided state on every change of that setting.
         * If the state should also depend on the value of the triggering settings, use
         * {@link #computeFromValueSupplier} instead.
         *
         * @param id used for {@link Widget#ref} of a field
         * @param <T> the type of the dependency
         */
        <T> void computeOnValueChange(Class<? extends ValueRef<T>> id);

        /**
         * Refer to another {@link StateProvider} with this method to recompute this state whenever the provided state
         * of the given class changes and depend on its output.
         *
         * @param stateProviderClass the class of the other state provider
         * @return a supplier to be used during {@link #computeState}
         * @param <T> the type of the referenced provided state
         */
        <T> Supplier<T> computeFromProvidedState(Class<? extends StateProvider<T>> stateProviderClass);

        /**
         * Defines that the state is to be computed whenever a button with the given id is clicked
         *
         * @param ref used as {@link SimpleButtonWidget#ref}
         */
        void computeOnButtonClick(Class<? extends ButtonRef> ref);

        /**
         * Call this method to compute the state in a synchronous way when the dialog is opened. Combining this with
         * {@link #computeFromValueSupplier} or {@link #getValueSupplier} is currently not supported.
         */
        void computeBeforeOpenDiaog();

        /**
         * Call this method to compute the state immediately after the dialog is opened
         */
        void computeAfterOpenDialog();

    }

    /**
     * This method is called whenever the dialog is opened.
     *
     * @param initializer providing configuration methods to define triggers and dependencies of the method. This
     *            instance must not be used beyond the scope of this method. Any further call to one of its methods
     *            after the invocation of this method will result in a runtime exception.
     */
    void init(StateProviderInitializer initializer);

    /**
     * @return the provided state. It is either transformed directly to a specific update in the dialog or used as input
     *         for another {@link StateProvider}.
     */
    S computeState();

}
