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
 *   Feb 10, 2023 (hornm): created
 */
package org.knime.core.webui.node.view.image;

import static org.assertj.core.api.Assertions.assertThat;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Random;

import javax.imageio.ImageIO;

import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.Test;
import org.knime.core.data.image.ImageValue;
import org.knime.core.data.image.png.PNGImageContent;
import org.knime.core.node.port.image.ImagePortObject;
import org.knime.core.node.port.image.ImagePortObjectSpec;

/**
 * Tests {@link ImageViewUtil}.
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
class ImageViewUtilTest {

    /**
     * Tests that an image is registered with the image data map on ImageViewUtil::createInitialDataService and that
     * this image is removed from the map once the image resource is retrieved from the page.
     *
     * @throws IOException
     */
    @Test
    void testImageDataMap() throws IOException {

        var imageId = "foo";
        byte[] pngImageData = createPngImageData();
        var portObject = createImagePortObject(pngImageData);
        var imageValue = (ImageValue)portObject.toDataCell();

        var initialData = ImageViewUtil
            .createInitialDataService(() -> imageValue, () -> imageId,
                () -> new ImageViewViewSettings()).getInitialData();
        assertThat(initialData).contains("\"imagePath\":\"uiext/imageview/img/" + imageId + ".png\"");
        assertThat(ImageViewUtil.IMAGE_DATA_MAP.size()).isEqualTo(1);
        assertThat(ImageViewUtil.IMAGE_DATA_MAP.get(imageId + ".png")).isEqualTo(pngImageData);

        var imgResource = ImageViewUtil.PAGE.getResource("img/" + imageId + ".png").get();
        try (var imgResourceStream = imgResource.getInputStream()) {
            assertThat(IOUtils.toByteArray(imgResourceStream)).isEqualTo(pngImageData);
        }
        assertThat(ImageViewUtil.IMAGE_DATA_MAP).isEmpty();
    }

    static ImagePortObject createImagePortObject(final byte[] pngImageData) {
        var imageContent = new PNGImageContent(pngImageData);
        return new ImagePortObject(imageContent, new ImagePortObjectSpec(PNGImageContent.TYPE));
    }

    static byte[] createPngImageData() {
        var img = new BufferedImage(10, 10, BufferedImage.TYPE_INT_ARGB);
        var rand = new Random(58342);
        for (var x = 0; x < img.getHeight(); x++) {
            for (var y = 0; y < img.getWidth(); y++) {
                var val = rand.nextInt(256);
                int p = (0 << 24) | (val << 16) | (val << 8) | val;
                img.setRGB(x, y, p);
            }
        }

        var out = new ByteArrayOutputStream();
        try {
            ImageIO.write(img, "png", out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException(e); // NOSONAR
        }
    }

}
