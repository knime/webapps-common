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
 */
package org.knime.core.webui.node.view.image;

import java.util.Optional;
import java.util.function.Supplier;

import org.knime.core.data.image.ImageValue;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.webui.data.ApplyDataService;
import org.knime.core.webui.data.InitialDataService;
import org.knime.core.webui.data.RpcDataService;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.view.NodeView;
import org.knime.core.webui.node.view.PageFormat;
import org.knime.core.webui.node.view.image.data.ImageViewInitialData;
import org.knime.core.webui.page.Page;

/**
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
public final class ImageNodeView implements NodeView {

    private ImageViewViewSettings m_settings;

    private final Supplier<ImageValue> m_imageValueSupplier;

    private final Supplier<String> m_imageIdSupplier;

    /**
     * @param imageValueSupplier the supplier of the {@link ImageValue} which this view visualizes
     * @param imageIdSupplier the supplier of the id of the image which this view visualizes
     */
    public ImageNodeView(final Supplier<ImageValue> imageValueSupplier, final Supplier<String> imageIdSupplier) {
        m_imageValueSupplier = imageValueSupplier;
        m_imageIdSupplier = imageIdSupplier;
    }

    @Override
    public Page getPage() {
        return ImageViewUtil.PAGE;
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
    public Optional<InitialDataService<ImageViewInitialData>> createInitialDataService() {
        if (m_settings == null) {
            m_settings = new ImageViewViewSettings();
        }
        return Optional
            .of(ImageViewUtil.createInitialDataService(m_imageValueSupplier, m_imageIdSupplier, () -> m_settings));
    }

    @Override
    public Optional<RpcDataService> createRpcDataService() {
        return Optional.empty();
    }

    @Override
    public <D> Optional<ApplyDataService<D>> createApplyDataService() {
        return Optional.empty();
    }

    @Override
    public void validateSettings(final NodeSettingsRO settings) throws InvalidSettingsException {
        //
    }

    @Override
    public void loadValidatedSettingsFrom(final NodeSettingsRO settings) {
        try {
            m_settings = DefaultNodeSettings.loadSettings(settings, ImageViewViewSettings.class);
        } catch (InvalidSettingsException ex) {
            throw new IllegalStateException("The settings should have been validated first.", ex);
        }
    }

}
