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
 *   Feb 24, 2022 (hornm): created
 */
package org.knime.core.webui.node;

import java.util.Locale;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.regex.Pattern;

import org.knime.core.node.NodeFactory;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.util.Pair;
import org.knime.core.webui.node.PageCache.PageIdType;
import org.knime.core.webui.node.view.NodeViewManager;
import org.knime.core.webui.page.Page;
import org.knime.core.webui.page.Resource;

/**
 * Gives access to the pages and page resources for nodes (i.e. pages that represent, e.g., node dialogs and views) and
 * node-related ui elements (e.g. port view).
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @param <N> the node wrapper this manager operates on
 */
public final class PageResourceManager<N extends NodeWrapper> {

    /**
     * Returns a page path prefix for the path returned by {@link #getPagePath(NodeWrapper)}. The page path prefix helps
     * to separate pages of different page types (e.g. view or dialog) - such that page-ids (see
     * {@link #getPageId(NodeWrapper)}) only need to be unique within a page type.
     *
     * @param type the page type to get the prefix for. Can be {@code null} in case of a re-usable page (see
     *            {@link Page#getPageIdForReusablePage()}) - in that case the same page-path is supposed to be valid for
     *            all the different page-types
     *
     * @return the path prefix
     */
    public static String getPagePathPrefix(final PageType type) {
        return type == null ? "uiext" : ("uiext-" + type);
    }

    /**
     * The page kinds, i.e. defines what a page is supposed to represent.
     */
    public static enum PageType {
            /**
             * A node dialog.
             */
            DIALOG,
            /**
             * A node view
             */
            VIEW,
            /**
             * A port view.
             */
            PORT;

        @Override
        public String toString() {
            return super.toString().toLowerCase(Locale.ROOT);
        }

    }

    private final PageCache<N> m_pageCache = new PageCache<>();

    private final PageType m_pageType;

    /*
     * Domain name used to identify resources requested for a node view, node dialog or node port.
     */
    private final String m_domainName;

    private final String m_baseUrl;

    private final String m_nodeDebugPatternProp;

    private final String m_nodeDebugUrlProp;

    private final Function<N, Page> m_createPage;

    private final BiFunction<N, PagePathSegments, PagePathSegments> m_modifyPagePathSegments;

    private final BiFunction<String, PagePathSegments, PagePathSegments> m_decomposePagePath;

    private final boolean m_shouldCleanUpPageOnNodeStateChange;

    /**
     * @param pageType
     * @param createPage function that creates a new page for a given node wrapper
     */
    public PageResourceManager(final PageType pageType, final Function<N, Page> createPage) {
        this(pageType, createPage, null, null, false);
    }

    /**
     * @param pageType
     * @param createPage
     * @param modifyPagePathSegments optional function to modify the {@link PagePathSegments}; can be {@code null}
     * @param decomposePagePath an optional function to decompose the {@link PagePathSegments}; can be {@code null}
     * @param shouldCleanUpPageOnNodeStateChange whether to remove the page from the cache on node state change
     */
    public PageResourceManager(final PageType pageType, final Function<N, Page> createPage,
        final BiFunction<N, PagePathSegments, PagePathSegments> modifyPagePathSegments,
        final BiFunction<String, PagePathSegments, PagePathSegments> decomposePagePath,
        final boolean shouldCleanUpPageOnNodeStateChange) {
        m_pageType = pageType;
        m_createPage = createPage;
        m_modifyPagePathSegments = modifyPagePathSegments;
        m_decomposePagePath = decomposePagePath;
        m_shouldCleanUpPageOnNodeStateChange = shouldCleanUpPageOnNodeStateChange;
        m_domainName = "org.knime.core.ui." + m_pageType.toString();
        m_baseUrl = "http://" + m_domainName + "/";
        m_nodeDebugPatternProp = "org.knime.ui.dev.node." + m_pageType.toString() + ".url.factory-class";
        m_nodeDebugUrlProp = "org.knime.ui.dev.node." + m_pageType.toString() + ".url";
    }

    /**
     * @return a unique domain name used to identify page resources of this kind
     */
    public String getDomainName() {
        return m_domainName;
    }

    /**
     * @param nodeWrapper the node to get the page for
     *
     * @return the page for the given node
     * @throws IllegalArgumentException if there is no page given for the node
     */
    public Page getPage(final N nodeWrapper) {
        var pageId = getPageId(nodeWrapper);
        return getPage(pageId);
    }

    /**
     * @param pageId
     * @return the page for the given page-id or {@code null} if there is none
     */
    public final Page getPage(final String pageId) {
        return m_pageCache.getPage(pageId);
    }

    /**
     * @param nodeWrapper the node to get the id for
     * @return the page type
     */
    public String getPageId(final N nodeWrapper) {
        return m_pageCache.getOrCreatePageAndReturnPageId(nodeWrapper, m_createPage,
            m_shouldCleanUpPageOnNodeStateChange);
    }

    /**
     * The base url for the page and associated resources. It is only required if the AP is run as a desktop application
     * or the page resource used for image/report generation.
     *
     * It's <b>not</b> required if run within an 'executor' as part of the server infrastructure - in this case the base
     * url needs to be determined by the frontend.
     *
     * @return the base url
     */
    public String getBaseUrl() {
        return m_baseUrl;
    }

    /**
     * Optionally returns a debug url for a view (dialog etc.) which is controlled by a system property.
     *
     * @param nodeWrapper the node to get the debug url for
     * @return a debug url or an empty optional if none is set
     */
    public Optional<String> getDebugUrl(final N nodeWrapper) {
        String pattern = System.getProperty(m_nodeDebugPatternProp);
        String url = System.getProperty(m_nodeDebugUrlProp);
        if (url == null) {
            return Optional.empty();
        }
        var nodeContainer = nodeWrapper.get();
        if (nodeContainer instanceof NativeNodeContainer) {
            @SuppressWarnings("rawtypes")
            final Class<? extends NodeFactory> nodeFactoryClass =
                ((NativeNodeContainer)nodeContainer).getNode().getFactory().getClass();
            if (pattern == null || Pattern.matches(pattern, nodeFactoryClass.getName())) {
                return Optional.of(url);
            } else {
                return Optional.empty();
            }
        } else {
            return Optional.of(url);
        }
    }

    /**
     * Provides the relative path for a page. A page path is assembled of various path-segments, see
     * {@link PagePathSegments}.
     *
     * Here are examples of page paths as a function of, e.g., {@link PageType} and {@link PageIdType}:
     * <ul>
     * <li>a static node view: {@code uiext-view/org.knime...NodeFactory/index.html}</li>
     * <li>a static node dialog: {@code uiext-dialog/org.knime...NodeFactory/index.html}</li>
     * <li>a static-reusable view (i.e. to be re-used between ui-extension types and node instances; e.g. node or port
     * view): {@code uiext/tableview/TableView.umd.js}</li>
     * <li>a non-static node view: {@code uiext-port/5_4_3/342342/index.html} (where {@code 5_4_3} is the node id of the
     * the view belongs to, and {@code 342342} the 'page-content-id' - see
     * {@link NodeViewManager#getPagePathSegments(NodeWrapper)})</li>
     * </ul>
     *
     * @param nodeWrapper the node which provides the page
     * @return the relative page path
     */
    public String getPagePath(final N nodeWrapper) {
        return composePagePath(getPagePathSegments(nodeWrapper));
    }

    private static String composePagePath(final PagePathSegments segments) {
        if (segments.pageContentId() == null) {
            return String.format("%s/%s/%s", segments.pathPrefix(), segments.pageId(), segments.relativePagePath());
        } else {
            return String.format("%s/%s/%s/%s", segments.pathPrefix(), segments.pageId(), segments.pageContentId(),
                segments.relativePagePath());
        }
    }

    /**
     * Determines the {@link PagePathSegments} for the given node-wrapper.
     *
     * @param nodeWrapper
     * @return the segments
     */
    private PagePathSegments getPagePathSegments(final N nodeWrapper) {
        var pageId = getPageId(nodeWrapper);
        var page = m_pageCache.getPage(pageId);
        var pagePathPrefix = page.getPageIdForReusablePage().isPresent() ? PageResourceManager.getPagePathPrefix(null)
            : PageResourceManager.getPagePathPrefix(m_pageType);
        var segments = new PagePathSegments(pagePathPrefix, pageId, null, page.getRelativePath());
        if (m_modifyPagePathSegments != null) {
            segments = m_modifyPagePathSegments.apply(nodeWrapper, segments);
        }
        return segments;
    }

    /**
     * Gives access to page resources. NOTE: Only those resources are available that belong to a page whose path has
     * been requested via {@link #getPagePath(NodeWrapper)}.
     *
     * @param resourceId the id of the resource
     * @return the resource or an empty optional if there is no resource for the given id available
     */
    public Optional<Resource> getPageResource(final String resourceId) {
        var pageIdAndRelativeResourcePath = getPageAndRelativeResourcePath(resourceId);
        if (pageIdAndRelativeResourcePath == null) {
            return Optional.empty();
        }

        var page = pageIdAndRelativeResourcePath.getFirst();
        if (page == null) {
            return Optional.empty();
        }

        var relPath = pageIdAndRelativeResourcePath.getSecond();
        if (page.getRelativePath().equals(relPath)) {
            return Optional.of(page);
        } else {
            return page.getResource(relPath);
        }
    }

    /**
     * Extracts the page and the relative resource path from a path which is constructed via
     * {@link #getPagePath(NodeWrapper)}.
     *
     * @param path the path to extract it from
     * @return a pair of page and path or {@code null}
     */
    private Pair<Page, String> getPageAndRelativeResourcePath(final String path) {
        var segments = decomposePagePath(path);
        if (segments == null) {
            return null;
        }
        assert segments.pathPrefix().startsWith("uiext-" + m_pageType.toString())
            || segments.pathPrefix().equals("uiext");
        var page = m_pageCache.getPage(segments.pageId());
        return page == null ? null : Pair.create(page, segments.relativePagePath());
    }

    /**
     * Decomposes a string-path into its {@link PagePathSegments}.
     *
     * @param path
     * @return the segments or {@code null} if the path couldn't be decomposed
     */
    private PagePathSegments decomposePagePath(final String path) {
        var split = path.split("/", 3);
        if (split.length != 3) {
            return null;
        }
        var segments = new PagePathSegments(split[0], split[1], null, split[2]);
        if (m_decomposePagePath != null) {
            segments = m_decomposePagePath.apply(path, segments);
        }
        return segments;
    }

    /**
     * Gives access to page resources via a full URL. NOTE: Only those resources are available that belong to a page
     * whose URL has been requested via {@link #getPage(NodeWrapper)}.
     *
     * @param url the resource url
     * @return the resource or an empty optional if there is no resource available at the given URL
     */
    public Optional<Resource> getPageResourceFromUrl(final String url) {
        return getPageResource(getResourceIdFromUrl(url));
    }

    private String getResourceIdFromUrl(final String url) {
        return url.replace(m_baseUrl, "");
    }

    /**
     * Clears the page cache.
     */
    public final void clearPageCache() {
        m_pageCache.clear();
    }

    /**
     * For testing purposes only.
     *
     * @return the page cache size
     */
    public int getPageCacheSize() {
        return m_pageCache.size();
    }

}