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
 *   Nov 11, 2022 (hornm): created
 */
package org.knime.core.webui.node.view.table.data.render;

import static org.assertj.core.api.Assertions.assertThat;
import static org.knime.testing.util.TableTestUtil.createDefaultTestTable;

import java.awt.Dimension;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.knime.core.webui.data.DataServiceContextTest;
import org.knime.core.webui.node.view.table.data.TableViewDataServiceImpl;
import org.knime.testing.util.TableTestUtil;

/**
 * Tests for the {@link DataValueImageRendererRegistry}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public class DataValueImageRendererRegistryTest {

    @BeforeEach
    void initDataServiceContext() {
        DataServiceContextTest.initDataServiceContext(() -> TableTestUtil.getExec(), null);
    }

    @AfterEach
    void removeDataServiceContext() {
        DataServiceContextTest.removeDataServiceContext();
    }

    /**
     * Tests the interplay of the {@link TableViewDataServiceImpl} and the {@link DataValueImageRendererRegistry}.
     */
    @Test
    void testRenderImage() {
        var tableSupplier = createDefaultTestTable(15);

        var imgReg = new DataValueImageRendererRegistry(() -> "test_page_id");
        var dataService =
            new TableViewDataServiceImpl(tableSupplier, "test_table_id", new SwingBasedRendererFactory(), imgReg);
        var pathPrefix = "uiext/test_page_id/images/";

        // test pre-condition: make sure that all images in the table have unique ids
        var table = dataService.getTable(new String[]{"image"}, 0, 15, null, false, false, false, false);
        assertThat(table.getRows().stream().map(r -> r.get(1)).collect(Collectors.toSet())).hasSize(15);
        imgReg.clearImageDataCache("test_table_id");

        // access the same image multiple times (within the same chunk/page of rows)
        table = dataService.getTable(new String[]{"image"}, 0, 5, null, false, false, false, false);
        var imgPath = ((String)table.getRows().get(3).get(2)).replace(pathPrefix, "");
        var img = imgReg.renderImage(imgPath);
        assertThat(img).hasSizeGreaterThan(0);
        img = imgReg.renderImage(imgPath);
        assertThat(img).hasSizeGreaterThan(0);

        // request a new chunk of rows, but still access image resources from the previous chunk
        table = dataService.getTable(new String[]{"image"}, 5, 5, null, false, false, false, false);
        img = imgReg.renderImage(imgPath);
        assertThat(img).hasSizeGreaterThan(0);
        // request image from the new chunk
        imgPath = ((String)table.getRows().get(3).get(2)).replace(pathPrefix, "");
        img = imgReg.renderImage(imgPath);
        assertThat(img).hasSizeGreaterThan(0);

        // do the same again but with the image data cache cleared
        table = dataService.getTable(new String[]{"image"}, 10, 5, null, false, true, false, false);
        // request image from the previous chunk
        img = imgReg.renderImage(imgPath);
        assertThat(img).hasSize(0);
        imgPath = ((String)table.getRows().get(3).get(2)).replace(pathPrefix, "");
        // request image from the new chunk
        img = imgReg.renderImage(imgPath);
        assertThat(img).hasSizeGreaterThan(0);

    }

    @Test
    void testGetImageDimensions() {
        var tableSupplier = createDefaultTestTable(15);

        var imgReg = new DataValueImageRendererRegistry(() -> "test_page_id");
        var dataService =
            new TableViewDataServiceImpl(tableSupplier, "test_table_id", new SwingBasedRendererFactory(), imgReg);
        var pathPrefix = "uiext/test_page_id/images/";

        // read dimensions of same image twice
        var table = dataService.getTable(new String[]{"image"}, 0, 5, null, false, false, false, false);
        var imgPath = ((String)table.getRows().get(3).get(2)).replace(pathPrefix, "");
        var imgDims = imgReg.getImageDimensions(imgPath);
        assertThat(imgDims).hasFieldOrPropertyWithValue("heightInPx", 11);
        assertThat(imgDims).hasFieldOrPropertyWithValue("widthInPx", 11);

        imgDims = imgReg.getImageDimensions(imgPath);
        assertThat(imgDims).hasFieldOrPropertyWithValue("heightInPx", 11);
        assertThat(imgDims).hasFieldOrPropertyWithValue("widthInPx", 11);

        // clear image cache and access data from previous and new chunk
        table = dataService.getTable(new String[]{"image"}, 10, 5, null, false, true, false, false);

        imgDims = imgReg.getImageDimensions(imgPath);
        assertThat(imgDims).isNull();

        imgPath = ((String)table.getRows().get(3).get(2)).replace(pathPrefix, "");
        imgDims = imgReg.getImageDimensions(imgPath);
        assertThat(imgDims).hasFieldOrPropertyWithValue("heightInPx", 11);
        assertThat(imgDims).hasFieldOrPropertyWithValue("widthInPx", 11);

    }

    /**
     * Makes sure that the image data cache keeps/clears the expected amount of image data.
     */
    @Test
    void testImageDataStats() {
        var tableSupplier = createDefaultTestTable(300);
        var imgReg = new DataValueImageRendererRegistry(() -> "test_page_id");
        var tableId = "test_table_id";
        var dataService = new TableViewDataServiceImpl(tableSupplier, tableId, new SwingBasedRendererFactory(), imgReg);
        var pathPrefix = "uiext/test_page_id/images/";

        var imgPaths = new HashSet<String>();

        var rendererIds = new String[]{"org.knime.core.data.renderer.DoubleBarRenderer$Factory", null};
        var columns = new String[]{"double", "image"};
        for (var i = 0; i <= 1; i++) {
            var table = dataService.getTable(columns, i * 100l, 100, rendererIds, false, false, false, false);
            table.getRows().forEach(r -> imgPaths.add((String)r.get(1)));
            var stats = imgReg.getStatsPerTable(tableId);
            assertThat(stats.numImages()).isEqualTo((i + 1) * 100 * 2); // there are two images per row
            var batchSizes = new int[i + 1];
            Arrays.fill(batchSizes, 100 * 2);
            assertThat(stats.batchSizes()).isEqualTo(batchSizes);
            imgReg.renderImage(((String)table.getRows().get(0).get(2)).replace(pathPrefix, ""));
            imgReg.renderImage(((String)table.getRows().get(50).get(2)).replace(pathPrefix, ""));
            assertThat(stats.numRenderedImages()).isEqualTo(2 * (i + 1));
        }
        assertThat(imgReg.getStatsPerTable(tableId).batchSizes()).isEqualTo(new int[]{200, 200});

        // the image data cache has it's limit at 2 row batches -> if exceed, the oldest batch is removed
        var table = dataService.getTable(columns, 200, 80, rendererIds, false, false, false, false);
        table.getRows().forEach(r -> imgPaths.add((String)r.get(1)));
        var stats = imgReg.getStatsPerTable(tableId);
        assertThat(stats.numImages()).isEqualTo(360); // there are two images per row
        var batchSizes = new int[]{160, 200};
        assertThat(stats.batchSizes()).isEqualTo(batchSizes);

        // assure that all img-paths in the image-column are unique (test pre-condition)
        assertThat(imgPaths).hasSize(280);

        // makes sure that the image data cache is cleared, when the respective parameter is passed to the data service
        dataService.getTable(new String[]{"image"}, 200, 10, null, false, true, false, false);
        stats = imgReg.getStatsPerTable(tableId);
        assertThat(stats.numImages()).isEqualTo(10);
        assertThat(stats.batchSizes()).isEqualTo(new int[]{10});

        // clear again directly
        imgReg.clearImageDataCache(tableId);
        imgReg.startNewBatchOfTableRows(tableId);
        stats = imgReg.getStatsPerTable(tableId);
        assertThat(stats.numImages()).isZero();
        assertThat(stats.batchSizes()).isEqualTo(new int[1]);
        assertThat(imgReg.numRegisteredTables()).isEqualTo(1);

        // what if table-id is null?
        imgReg.clearImageDataCache(tableId);
        imgReg.startNewBatchOfTableRows(null);
        assertThat(imgReg.numRegisteredTables()).isZero();
    }

    /**
     * Tests that images aren't removed from the cache in case they are part of two row-batches, a newer one and a an
     * older, to-be-removed, batch.
     */
    @Test
    public void testThatImagesRemainInTheCacheIfPartOfMultipleRowBatches() {
        var tableSupplier = createDefaultTestTable(600, idx -> idx % 100);
        var imgReg = new DataValueImageRendererRegistry(() -> "test_page_id");
        var tableId = "test_table_id";
        var dataService = new TableViewDataServiceImpl(tableSupplier, tableId, new SwingBasedRendererFactory(), imgReg);

        dataService.getTable(new String[]{"image"}, 0, 475, null, false, false, false, false);
        var stats = imgReg.getStatsPerTable(tableId);
        assertThat(stats.numImages()).isEqualTo(100);

        dataService.getTable(new String[]{"image"}, 475, 50, null, false, false, false, false);
        dataService.getTable(new String[]{"image"}, 525, 25, null, false, false, false, false);
        stats = imgReg.getStatsPerTable(tableId);
        assertThat(stats.numImages()).isEqualTo(75);

    }

    @Nested
    final class RenderImageTest {

        private static String imgPath;

        private static DataValueImageRendererRegistry imgReg;

        private static String tableId = "test_table_id";

        @BeforeEach
        void setUp() {
            var tableSupplier = createDefaultTestTable(15);

            imgReg = new DataValueImageRendererRegistry(() -> "test_page_id");
            var dataService =
                new TableViewDataServiceImpl(tableSupplier, tableId, new SwingBasedRendererFactory(), imgReg);
            var pathPrefix = "uiext/test_page_id/images/";

            var table = dataService.getTable(new String[]{"image"}, 0, 15, null, false, false, false, false);
            imgReg.clearImageDataCache("test_table_id");

            table = dataService.getTable(new String[]{"image"}, 0, 5, null, false, false, false, false);
            imgPath = ((String)table.getRows().get(3).get(2)).replace(pathPrefix, "");

        }

        /**
         * Test that images are cached with respect to dimension parameters.
         */
        @Test
        void testImageDataCachedPerDimension() {
            var res1 = imgReg.renderImage(imgPath);
            var res2 = imgReg.renderImage(imgPath + "?w=2&h=3");
            var res3 = imgReg.renderImage(imgPath);
            var res4 = imgReg.renderImage(imgPath + "?w=3&h=1");
            var res5 = imgReg.renderImage(imgPath + "?w=2&h=3");
            var numCalls = imgReg.getStatsPerTable(tableId).numRenderImageCalls();
            assertThat(res3).as("Requests without width and heigt parameter should be cached").isSameAs(res1);
            assertThat(res5).as("Requests with width and heigt parameter should be cached").isSameAs(res2);
            assertThat(res4).as("Requests with different inputs should yield different output").isNotSameAs(res2);
            assertThat(numCalls).as("Correct number of calls in total").isEqualTo(3);
        }

        /**
         * Test that if the requested height or width is larger than the preferred one, the preferred one is used
         * instead.
         * @throws IOException
         */
        @Test
        void testReducesImagesToTheirPreferredImageSize() throws IOException {
            var res1 = getImageDimensions(imgReg.renderImage(imgPath));
            var res2 = getImageDimensions(imgReg.renderImage(imgPath + "?w=100&h=100"));
            var res3 = getImageDimensions(imgReg.renderImage(imgPath + "?w=1&h=100"));
            var res4 = getImageDimensions(imgReg.renderImage(imgPath + "?w=1&h=11"));
            var res5 = getImageDimensions(imgReg.renderImage(imgPath + "?w=100&h=1"));
            var res6 = getImageDimensions(imgReg.renderImage(imgPath + "?w=11&h=1"));
            var numCalls = imgReg.getStatsPerTable(tableId).numRenderImageCalls();
            assertThat(res1).as("Requests without width and heigt parameter should yield the"
                + " same result as with large width and height").isEqualTo(res2);
            assertThat(res3).as("Too large dimensions should be scaled to the preferred one at max.").isEqualTo(res4)
                .isEqualTo(res5).isEqualTo(res6);
            // TODO UIEXT-1361 ideally the number of calls would be the same as the number of different results.
            assertThat(numCalls).as("Correct number of calls in total").isEqualTo(6);
        }

        private Dimension getImageDimensions(final byte[] byteImage) throws IOException {
            final var image = ImageIO.read(new ByteArrayInputStream(byteImage));
            return new Dimension(image.getHeight(), image.getWidth());
        }
    }

}
