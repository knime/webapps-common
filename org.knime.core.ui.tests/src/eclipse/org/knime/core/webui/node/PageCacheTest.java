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
 *   Apr 27, 2023 (hornm): created
 */
package org.knime.core.webui.node;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.WorkflowManager;
import org.knime.core.webui.page.Page;
import org.knime.core.webui.page.PageTest;
import org.knime.testing.node.view.NodeViewNodeFactory;
import org.knime.testing.util.WorkflowManagerUtil;

/**
 * Tests the {@link PageCache}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class PageCacheTest {

    private WorkflowManager m_wfm;

    private NativeNodeContainer m_nnc;

    @BeforeEach
    void createWorkflowWithNode() throws IOException {
        m_wfm = WorkflowManagerUtil.createEmptyWorkflow();
        m_nnc = WorkflowManagerUtil.createAndAddNode(m_wfm, new NodeViewNodeFactory(0, 0));
        m_wfm.executeAllAndWaitUntilDone();
    }

    @AfterEach
    void disposeWorkflow() {
        WorkflowManagerUtil.disposeWorkflow(m_wfm);
    }

    @Test
    void testGetPageIdAndPage() throws IOException {
        var pageCache = new PageCache<NodeWrapper>();

        assertThat(pageCache.getPage("random_id")).isNull();

        var nodeWrapperMock = mock(NodeWrapper.class);
        when(nodeWrapperMock.getNodeWrapperTypeId()).thenReturn("nodeWrapperTypeId");
        when(nodeWrapperMock.get()).thenReturn(m_nnc);

        /* non-static page checks */

        var nonStaticPage = Page.builder(() -> "test", "page.html").build();
        var nonStaticPageId = pageCache.getOrCreatePageAndReturnPageId(nodeWrapperMock, nw -> nonStaticPage, true);
        assertThat(pageCache.getPage(nonStaticPageId)).isSameAs(nonStaticPage);
        pageCache.getOrCreatePageAndReturnPageId(nodeWrapperMock,
            nw -> Page.builder(() -> "test2", "page2.html").build(), true);
        assertThat(pageCache.getPage(nonStaticPageId)).as("original non-static page is still in cache")
            .isSameAs(nonStaticPage);
        assertThat(nonStaticPageId).isEqualTo(m_nnc.getID().toString().replace(":", "_"));

        m_wfm.resetAndConfigureAll();
        assertThat(pageCache.getPage(nonStaticPageId)).as("non-static page removed from cache after node reset")
            .isNull();

        /* static page checks */

        pageCache.clear();
        var staticPageBuilder = Page.builder(PageTest.BUNDLE_ID, "files", "component.umd.js");
        var staticPage = staticPageBuilder.build();
        var staticPageId = pageCache.getOrCreatePageAndReturnPageId(nodeWrapperMock, nw -> staticPage, true);
        assertThat(staticPageId).isEqualTo("nodeWrapperTypeId");
        assertThat(pageCache.getPage(staticPageId)).isSameAs(staticPage);
        pageCache.getOrCreatePageAndReturnPageId(nodeWrapperMock, nw -> staticPageBuilder.build(), true);
        assertThat(pageCache.getPage(staticPageId)).as("original static page is still in cache").isSameAs(staticPage);
        m_wfm.executeAllAndWaitUntilDone();
        m_wfm.resetAndConfigureAll();
        assertThat(pageCache.getPage(staticPageId)).as("node state change does not remove static page from cache")
            .isSameAs(staticPage);

        /* reusable static page checks */

        pageCache.clear();
        var reusableStaticPage = staticPageBuilder.markAsReusable("reusable_page_id").build();
        var reusableStaticPageId =
            pageCache.getOrCreatePageAndReturnPageId(nodeWrapperMock, nw -> reusableStaticPage, true);
        assertThat(reusableStaticPageId).isEqualTo("reusable_page_id");
        assertThat(pageCache.getPage(reusableStaticPageId)).isSameAs(reusableStaticPage);
        pageCache.getOrCreatePageAndReturnPageId(nodeWrapperMock,
            nw -> staticPageBuilder.markAsReusable("reusable_page_id").build(), true);
        assertThat(pageCache.getPage(reusableStaticPageId)).as("original reusable static page is still in cache")
            .isSameAs(reusableStaticPage);
        m_wfm.executeAllAndWaitUntilDone();
        m_wfm.resetAndConfigureAll();
        assertThat(pageCache.getPage(reusableStaticPageId))
            .as("node state change does not remove reusable static page from cache").isSameAs(reusableStaticPage);
    }

}
