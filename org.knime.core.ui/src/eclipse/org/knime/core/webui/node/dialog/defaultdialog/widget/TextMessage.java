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
 *   Sep 23, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.util.Optional;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;

/**
 * A simple message that can be displayed in the dialog. E.g. to inform the user that a certain setting is not displayed
 * because of contextual circumstances.
 *
 * Note that because this is not a setting, no {@link Widget @Widget} annotation should be present on this field and the
 * fields type must be {@link Void}.
 *
 * @author Paul Bärnreuther
 */
@Retention(RUNTIME)
@Target(FIELD)
public @interface TextMessage {

    /**
     * If a present optional is provided, a message is shown. If the state provider has not been triggered yet or the
     * last computed state is empty, no message is shown.
     *
     * @return the provider of the message.
     */
    Class<? extends StateProvider<Optional<Message>>> value();

    /**
     * Use this interface if the message does only depend on the context with a static title, description and type.
     */
    interface SimpleTextMessageProvider extends StateProvider<Optional<TextMessage.Message>> {

        /**
         * Determines if the message should be shown.
         *
         * @param context the context
         * @return true if the message should be shown
         */
        boolean showMessage(DefaultNodeSettingsContext context);

        /**
         * Must be non-null
         *
         * @return the title of the message
         */
        String title();

        /**
         * Must be non-null
         *
         * @return the description of the message
         */
        String description();

        /**
         * The type of the message determining the color and icon with which it is shown.
         *
         * @return the type of the message
         */
        MessageType type();

        @Override
        default void init(final StateProviderInitializer initializer) {
            initializer.computeBeforeOpenDialog();
        }

        @Override
        default Optional<Message> computeState(final DefaultNodeSettingsContext context) {
            if (showMessage(context)) {
                return Optional.of(new Message(title(), description(), type()));
            } else {
                return Optional.empty();
            }
        }

    }

    /**
     * @param title must be non-null
     * @param description must be non-null
     * @param type of the message determining the color and icon with which it is shown.
     */
    record Message(String title, String description, MessageType type) {
    }

    /**
     * The type of message.
     */
    enum MessageType {
            /**
             * An information message.
             */
            INFO,

            /**
             * A warning message.
             */
            WARNING,

            /**
             * An error message.
             */
            ERROR,

            /**
             * A success message.
             */
            SUCCESS,

            /**
             * A message that informs the user about KNIME News
             */
            PROMOTION
    }

}
