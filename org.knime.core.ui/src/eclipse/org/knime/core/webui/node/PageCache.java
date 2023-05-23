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
 *   Apr 17, 2023 (hornm): created
 */
package org.knime.core.webui.node;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.knime.core.webui.node.PageResourceManager.PageType;
import org.knime.core.webui.node.util.NodeCleanUpCallback;
import org.knime.core.webui.page.Page;

/**
 * Takes care of caching {@link Page Pages} for particular {@link NodeWrapper NodeWrappers}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @param <N>
 */
final class PageCache<N extends NodeWrapper> {

    /**
     * The page-id-type. It specifies how the actual page-id is determined (see
     * {@link #determinePageId(NodeWrapper, String)}).
     *
     * See also {@link PageResourceManager#getPagePath(NodeWrapper)}.
     */
    enum PageIdType {
            /**
             * A page-id for a non-static page ({@link Page#isCompletelyStatic()} is {@code false})
             */
            NON_STATIC,

            /**
             * A page-id for a static page ({@link Page#isCompletelyStatic()} is {@code true})
             */
            STATIC,

            /**
             * A re-usable page id ({@link Page#getPageIdForReusablePage()} is not empty).
             */
            STATIC_REUSABLE;

        /**
         * Determines the page-id based on this page-id-type.
         *
         * @param nw
         * @param pageType
         * @param reusablePageId
         * @return the page-id
         */
        String determinePageId(final NodeWrapper nw, final String reusablePageId) {
            return switch (this) {
                case STATIC_REUSABLE -> reusablePageId;
                case STATIC -> nw.getNodeWrapperTypeId();
                case NON_STATIC -> determineNonStaticPageId(nw);
            };
        }

        private static String determineNonStaticPageId(final NodeWrapper nw) {
            var nc = nw.get();
            return nc.getID().toString().replace(":", "_");
        }

    }

    private final Map<String, PageIdType> m_nodeWrapperTypeToPageIdTypeMap = new HashMap<>();

    private final Map<String, String> m_nodeWrapperTypeToReusablePageIdMap = new HashMap<>();

    private final Map<String, Page> m_pageIdToPageMap = new HashMap<>();

    /**
     * Gets the page from cache or creates a page (using the provided page-creator) and returns the page-id. The actual
     * page can then be retrieved via {@link #getPage(String)}.
     *
     * @param nodeWrapper
     * @param pageCreator used to create a new page in case when the page is not in the cache, yet
     * @param cleanUpPageOnNodeStateChange
     * @return the page-id
     */
    String getOrCreatePageAndReturnPageId(final N nodeWrapper, final Function<N, Page> pageCreator,
        final boolean cleanUpPageOnNodeStateChange) {
        var pageId = getPageIdForNodeWrapper(nodeWrapper);
        if (pageId == null || getPage(pageId) == null) {
            pageId = createPageAndDeterminePageId(nodeWrapper, pageCreator, cleanUpPageOnNodeStateChange);
        }
        return pageId;
    }

    private String getPageIdForNodeWrapper(final N nodeWrapper) {
        var nodeWrapperTypeId = nodeWrapper.getNodeWrapperTypeId();
        var pageIdType = m_nodeWrapperTypeToPageIdTypeMap.get(nodeWrapperTypeId);
        if (pageIdType == null) {
            return null;
        }
        return pageIdType.determinePageId(nodeWrapper, m_nodeWrapperTypeToReusablePageIdMap.get(nodeWrapperTypeId));
    }

    private String createPageAndDeterminePageId(final N nodeWrapper, final Function<N, Page> pageCreator,
        final boolean cleanUpPageOnNodeStateChange) {
        var page = pageCreator.apply(nodeWrapper);
        var reusablePageId = page.getPageIdForReusablePage().orElse(null);
        var isStatic = page.isCompletelyStatic();
        final PageIdType pageIdType;
        if (reusablePageId != null) {
            pageIdType = PageIdType.STATIC_REUSABLE;
        } else {
            pageIdType = isStatic ? PageIdType.STATIC : PageIdType.NON_STATIC;
        }

        var nodeWrapperTypeId = nodeWrapper.getNodeWrapperTypeId();
        m_nodeWrapperTypeToPageIdTypeMap.put(nodeWrapperTypeId, pageIdType);
        var pageId = pageIdType.determinePageId(nodeWrapper, reusablePageId);
        m_pageIdToPageMap.put(pageId, page);
        if (pageIdType == PageIdType.STATIC_REUSABLE) {
            m_nodeWrapperTypeToReusablePageIdMap.put(nodeWrapperTypeId, pageId);
        }

        if (pageIdType == PageIdType.NON_STATIC) {
            Runnable cleanUpPageMap = () -> m_pageIdToPageMap.remove(pageId);
            NodeCleanUpCallback.builder(nodeWrapper.get(), cleanUpPageMap)
                .cleanUpOnNodeStateChange(cleanUpPageOnNodeStateChange).build();
        }

        return pageId;
    }

    /**
     * Returns a page for a page-id. The page-id is determined via
     * {@link #getOrCreatePageAndReturnPageId(NodeWrapper, PageType, Function, boolean)}
     *
     * @param pageId
     * @return the page or {@code null} if there is none
     */
    Page getPage(final String pageId) {
        return m_pageIdToPageMap.get(pageId);
    }

    void clear() {
        m_nodeWrapperTypeToPageIdTypeMap.clear();
        m_nodeWrapperTypeToReusablePageIdMap.clear();
        m_pageIdToPageMap.clear();
    }

    int size() {
        return m_pageIdToPageMap.size();
    }

}
