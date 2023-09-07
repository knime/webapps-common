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
 *   28 Jun 2023 (Rupert Ettrich): created
 */
package org.knime.core.webui.node.view.textview;

import java.util.Optional;
import java.util.function.Supplier;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.workflow.FlowObjectStack;
import org.knime.core.webui.data.ApplyDataService;
import org.knime.core.webui.data.InitialDataService;
import org.knime.core.webui.data.RpcDataService;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettingsSerializer;
import org.knime.core.webui.node.view.NodeView;
import org.knime.core.webui.node.view.PageFormat;
import org.knime.core.webui.node.view.textview.data.TextViewInitialData;
import org.knime.core.webui.node.view.textview.data.TextViewInitialDataImpl;
import org.knime.core.webui.page.Page;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;

/**
 * A {@link NodeView} implementation for displaying tables.
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
public final class TextViewView implements NodeView {
    private TextViewViewSettings m_settings;

    private final Supplier<FlowObjectStack> m_flowObjectStackSupplier;

    private static PolicyFactory sanitizationPolicy = new HtmlPolicyBuilder()
            .allowCommonInlineFormattingElements()
            .allowCommonBlockElements()
            .allowElements("hr", "pre", "code")
            .toFactory();

    // Note on the 'static' page id: the entire TextView-page can be considered 'completely static'
    // because the page, represented by a vue component, is just a file (won't change at runtime)
    private static final String TEXT_VIEW_PAGE_ID = "textview";

    /**
     * The page representing the table view.
     */
    private static final Page PAGE =
        Page.builder(TextViewView.class, "js-src/dist", "TextView.umd.js").markAsReusable(TEXT_VIEW_PAGE_ID).build();

    /**
     * @param flowObjectStackSupplier the supplier of the {@link FlowObjectStack} that is passed to the
     *            {@link TextViewInitialDataServiceImpl}
     */
    public TextViewView(final Supplier<FlowObjectStack> flowObjectStackSupplier) {
        m_flowObjectStackSupplier = flowObjectStackSupplier;
    }

    @Override
    public Page getPage() {
        return PAGE;
    }

    @Override
    public PageFormat getDefaultPageFormat() {
        return PageFormat.AUTO;
    }

    @Override
    public boolean canBeUsedInReport() {
        return true;
    }

    @SuppressWarnings("unchecked")
    @Override
    public Optional<InitialDataService<TextViewInitialData>> createInitialDataService() {
        if (m_settings == null) {
            m_settings = new TextViewViewSettings();
        }
        return Optional.of(createInitialDataService(() -> m_settings, m_flowObjectStackSupplier));
    }

    @Override
    public void validateSettings(final NodeSettingsRO settings) throws InvalidSettingsException {
        //
    }

    @Override
    public void loadValidatedSettingsFrom(final NodeSettingsRO settings) {
        try {
            m_settings = DefaultNodeSettings.loadSettings(settings, TextViewViewSettings.class);
            if (m_settings.m_richTextContent != null) {
                m_settings.m_richTextContent =
                    sanitizationPolicy.sanitize(m_settings.m_richTextContent);
            }
        } catch (InvalidSettingsException ex) {
            throw new IllegalStateException("The settings should have been validated first.", ex);
        }
    }

    @Override
    public <D> Optional<ApplyDataService<D>> createApplyDataService() {
        return Optional.empty();
    }

    @Override
    public Optional<RpcDataService> createRpcDataService() {
        return Optional.empty();
    }

    static TextViewInitialData createInitialData(final TextViewViewSettings settings,
        final FlowObjectStack flowObjectStack) {
        return new TextViewInitialDataImpl(settings, flowObjectStack);
    }

    static InitialDataService<TextViewInitialData> createInitialDataService(
        final Supplier<TextViewViewSettings> settingsSupplier,
        final Supplier<FlowObjectStack> flowObjectStackSupplier) {
        return InitialDataService
            .builder(() -> createInitialData(settingsSupplier.get(), flowObjectStackSupplier.get())) //
            .serializer(new DefaultNodeSettingsSerializer<>()) //
            .build();
    }
}