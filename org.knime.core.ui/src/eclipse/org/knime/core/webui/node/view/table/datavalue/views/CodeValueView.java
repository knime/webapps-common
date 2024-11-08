/*
 * ------------------------------------------------------------------------
 *
 *  Copyright by KNIME AG, Zurich, Switzerland
 *  Website: http://www.knime.org; Email: contact@knime.org
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
 *   Oct 30, 2024 (Robin Gerling): created
 */
package org.knime.core.webui.node.view.table.datavalue.views;

import java.util.Locale;
import java.util.Optional;

import org.knime.core.webui.data.InitialDataService;
import org.knime.core.webui.data.RpcDataService;
import org.knime.core.webui.node.view.table.TableView;
import org.knime.core.webui.node.view.table.datavalue.DataValueView;
import org.knime.core.webui.page.Page;

/**
 * A view showing a read-only code editor.
 *
 * @author Robin Gerling
 */
public interface CodeValueView extends DataValueView {

    /**
     * Available languages for the code value view
     */
    enum CodeValueViewLanguages {
            XML, JSON;

        @Override
        public String toString() {
            return name().toLowerCase(Locale.getDefault());
        }
    }

    /**
     *
     * @param code the code as text to visualize in the data value view
     * @param language the language used for syntax highlighting in the data value view
     */
    record CodeValueViewInitialData(String code, CodeValueViewLanguages language) {
    }

    @Override
    default Page getPage() {
        return Page.builder(TableView.class, "js-src/dist", "CodeValueView.html").addResourceDirectory("assets")
            .build();
    }

    /**
     *
     * @return the initial data shown in the view
     */
    CodeValueViewInitialData getInitialData();

    @Override
    default Optional<InitialDataService<CodeValueViewInitialData>> createInitialDataService() {
        return Optional.of(InitialDataService.builder(this::getInitialData).build());
    }

    @Override
    default Optional<RpcDataService> createRpcDataService() {
        return Optional.empty();
    }
}
