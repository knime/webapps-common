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

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

import org.apache.commons.io.output.ByteArrayOutputStream;
import org.knime.core.data.image.ImageValue;
import org.knime.core.node.NodeLogger;
import org.knime.core.webui.data.InitialDataService;
import org.knime.core.webui.node.PageResourceManager;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettingsSerializer;
import org.knime.core.webui.node.view.image.data.ImageViewInitialData;
import org.knime.core.webui.node.view.image.data.ImageViewInitialDataImpl;
import org.knime.core.webui.page.Page;

/**
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
public final class ImageViewUtil {

    /*
     * This map is sort of a 'very short term cache'. It keeps image data for a certain image id. The image-id is
     * returned via the initial data service (as part of a (relative) url). And as soon as the provided URL is 'used' in
     * the FE (e.g. in an img-src attribute or via another fetch), the actual image data is fetched through the CEF's
     * middleware service and immediately removed from this map, once it has been fetched.
     */
    static final Map<String, byte[]> IMAGE_DATA_MAP = new HashMap<>();

    /*
     * Note on the 'static' page id: the entire image view page can be considered 'completely static' because the page,
     * represented by a vue component, is just a file (won't change at runtime) And the image resource associated with a
     * page of an individual image view instance is served with a globally unique 'image id' in the path.
     */
    private static final String IMAGE_VIEW_PAGE_ID = "imageview";

    /**
     * The page representing the image view.
     */
    public static final Page PAGE = Page.builder(ImageViewUtil.class, "js-src/dist", "ImageView.umd.js") //
        .markAsReusable(IMAGE_VIEW_PAGE_ID) //
        .addResources(imageId -> new ByteArrayInputStream(IMAGE_DATA_MAP.remove(imageId)), "img", true) //
        .build();

    /**
     * @param imageValueSupplier the supplier of the {@link ImageValue}
     * @param imageIdSupplier the supplier of the (unique) image Id
     * @param settingsSupplier the supplier of the image view settings to be included with the initial data
     * @return a new initial data service
     */
    public static InitialDataService<ImageViewInitialData> createInitialDataService(
        final Supplier<ImageValue> imageValueSupplier, final Supplier<String> imageIdSupplier,
        final Supplier<ImageViewViewSettings> settingsSupplier) {
        return InitialDataService
            .builder(() -> createInitialData(imageValueSupplier, imageIdSupplier, settingsSupplier)) //
            .serializer(new DefaultNodeSettingsSerializer<>()) //
            .build();
    }

    static ImageViewInitialData createInitialData(final Supplier<ImageValue> imageValueSupplier,
        final Supplier<String> imageIdSupplier, final Supplier<ImageViewViewSettings> settingsSupplier) {
        final var imageValue = imageValueSupplier.get();
        final var imageId = imageIdSupplier.get() + "." + imageValue.getImageExtension();
        IMAGE_DATA_MAP.put(imageId, getImageData(imageValue));
        final var imagePath = PageResourceManager.getPagePathPrefix(null) + "/imageview/img/" + imageId;
        return new ImageViewInitialDataImpl(imagePath, settingsSupplier.get());
    }

    private static byte[] getImageData(final ImageValue imgValue) {
        var imageContent = imgValue.getImageContent();
        try (var baos = new ByteArrayOutputStream()) {
            imageContent.save(baos);
            return baos.toByteArray();
        } catch (IOException ex) {
            NodeLogger.getLogger(ImageViewUtil.class).error("Image content couldn't be extracted from image port", ex);
            return new byte[0];
        }
    }

    private ImageViewUtil() {
        // Utility class
    }

}
