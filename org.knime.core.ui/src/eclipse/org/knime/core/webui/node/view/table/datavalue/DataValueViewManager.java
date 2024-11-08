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
 *   Sep 16, 2024 (hornm): created
 */
package org.knime.core.webui.node.view.table.datavalue;

import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.WeakHashMap;

import org.knime.core.data.DataCell;
import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataType;
import org.knime.core.data.DataValue;
import org.knime.core.data.container.filter.TableFilter;
import org.knime.core.data.v2.RowCursor;
import org.knime.core.data.xml.XMLValue;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.webui.node.DataServiceManager;
import org.knime.core.webui.node.DataValueWrapper;
import org.knime.core.webui.node.PageResourceManager;
import org.knime.core.webui.node.PageResourceManager.CreatedPage;
import org.knime.core.webui.node.PageResourceManager.PageType;
import org.knime.core.webui.node.util.NodeCleanUpCallback;
import org.knime.core.webui.node.view.table.data.render.DataCellContentType;
import org.knime.core.webui.node.view.table.data.render.DataValueTextRenderer;
import org.knime.core.webui.node.view.table.data.render.SwingBasedRendererFactory;
import org.knime.core.webui.node.view.table.datavalue.views.XMLCodeValueView;

/**
 * Singleton for registering factories for creating (@link DataValueView}s.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public final class DataValueViewManager {

    private final Map<Class<? extends DataValue>, DataValueViewFactory<? extends DataValue>> m_dataValueViewFactories;

    private DataValueViewManager() {
        m_dataValueViewFactories = DataValueViewExtensionsUtil.getDataValueViewExtensions();
        m_dataValueViewFactories.put(XMLValue.class, cell -> new XMLCodeValueView((XMLValue<?>)cell));
    }

    private static DataValueViewManager instance;

    /**
     * package scoped for testing {@link #getDataValueView(DataValueWrapper)}
     */
    record CreatedDataValueView(DataValueView view, Class<? extends DataValue> dataValueClass) {
        CreatedPage toCreatedPage() {
            return new CreatedPage(view.getPage(), dataValueClass.getName());
        }
    }

    private final Map<DataValueWrapper, CreatedDataValueView> m_dataValueViewMap = new WeakHashMap<>();

    private final PageResourceManager<DataValueWrapper> m_pageResourceManager =
        new PageResourceManager<>(PageType.DATA_VALUE, dvw -> getDataValueView(dvw).toCreatedPage(), null, null, true);

    private final DataServiceManager<DataValueWrapper> m_dataServiceManager =
        new DataServiceManager<>(dvw -> getDataValueView(dvw).view(), true);

    /**
     * @return a singleton instance of this class
     */
    public static synchronized DataValueViewManager getInstance() {
        if (instance == null) {
            instance = new DataValueViewManager();
        }
        return instance;
    }

    /**
     * Register a factory used to create {@link DataValueView}s for a specific {@link DataValue} type.
     *
     * @param dataValueClass the data value type
     * @param factory the factory
     * @param <V>
     */
    public static <V extends DataValue> void registerDataValueViewFactory(final Class<V> dataValueClass,
        final DataValueViewFactory<V> factory) {
        getInstance().m_dataValueViewFactories.put(dataValueClass, factory);
    }

    /**
     * For testing purposes
     *
     * @param dataValueClass
     */
    public static void removeDataValueViewFactory(final Class<?> dataValueClass) {
        getInstance().m_dataValueViewFactories.remove(dataValueClass);
    }

    /**
     * Package scoped for tests
     *
     * @param wrapper identifying a data value
     * @return the {@link DataValueView} for the given {@link DataValueWrapper}
     * @throws NoSuchElementException if no data value can be created
     * @throws NoSuchElementException if no data value view is available
     */
    @SuppressWarnings("unchecked")
    CreatedDataValueView getDataValueView(final DataValueWrapper wrapper) {
        if (m_dataValueViewMap.containsKey(wrapper)) {
            return m_dataValueViewMap.get(wrapper);
        }

        var table = extractTable(wrapper);
        var colSpec = extractDataColumnSpec(wrapper, table);
        var dataCell = extractDataCell(wrapper, table);

        var htmlRenderer = getAttachedHTMLRenderer(colSpec);
        if (htmlRenderer != null) {
            return new CreatedDataValueView(new HTMLValueView(() -> htmlRenderer.renderText(dataCell)),
                dataCell.getClass());
        }

        var chosenValue = findCompatibleValue(dataCell.getType());
        if (chosenValue.isPresent()) {
            @SuppressWarnings("rawtypes")
            DataValueViewFactory factory = m_dataValueViewFactories.get(chosenValue.get());
            final var dataValueView = factory.createDataValueView(dataCell);
            final var createdDataValueView = new CreatedDataValueView(dataValueView, chosenValue.get());
            m_dataValueViewMap.put(wrapper, createdDataValueView);
            NodeCleanUpCallback.builder(wrapper.get(), () -> m_dataValueViewMap.remove(wrapper))
                .cleanUpOnNodeStateChange(true).build();
            return createdDataValueView;
        } else {
            throw new NoSuchElementException(
                String.format("No data value view is available for data type %s", dataCell.getType()));
        }
    }

    private static BufferedDataTable extractTable(final DataValueWrapper wrapper) {
        var nc = wrapper.get();
        var portIdx = wrapper.getPortIdx();
        if (portIdx < 0 || portIdx >= nc.getNrOutPorts()) {
            throw new NoSuchElementException("No port at index " + portIdx);
        }
        var outPort = nc.getOutPort(portIdx);
        if (!outPort.getPortType().equals(BufferedDataTable.TYPE)) {
            throw new NoSuchElementException("No data table at index " + portIdx);
        }
        var table = (BufferedDataTable)outPort.getPortObject();
        if (table == null) {
            throw new NoSuchElementException("No data table available at index " + portIdx);
        }
        return table;
    }

    private static DataColumnSpec extractDataColumnSpec(final DataValueWrapper wrapper, final BufferedDataTable table) {
        return table.getDataTableSpec().getColumnSpec(wrapper.getColIdx());
    }

    private static DataCell extractDataCell(final DataValueWrapper wrapper, final BufferedDataTable table) {
        return getDataCellAt(wrapper.getRowIdx(), wrapper.getColIdx(), table);
    }

    private static DataCell getDataCellAt(final int rowIdx, final int colIdx, final BufferedDataTable table) {
        try (final var cursor = createCursor(rowIdx, colIdx, table)) {
            return cursor.forward().getAsDataCell(colIdx);
        }
    }

    private static RowCursor createCursor(final int rowIdx, final int colIdx, final BufferedDataTable table) {
        var filter = new TableFilter.Builder() //
            .withFromRowIndex(rowIdx)//
            .withMaterializeColumnIndices(colIdx)//
            .build();
        return table.cursor(filter);
    }

    /**
     * @return the {@link PageResourceManager} instance
     */
    public PageResourceManager<DataValueWrapper> getPageResourceManager() {
        return m_pageResourceManager;
    }

    /**
     * @return the {@link DataServiceManager} instance
     */
    public DataServiceManager<DataValueWrapper> getDataServiceManager() {
        return m_dataServiceManager;
    }

    /**
     * @param dataType of a column
     * @return whether a {@link DataValueView} is available for the given data type
     */
    public boolean hasDataValueView(final DataType dataType) {
        return findCompatibleValue(dataType).isPresent();
    }

    private Optional<Class<? extends DataValue>> findCompatibleValue(final DataType type) {
        return type.getValueClasses().stream().filter(m_dataValueViewFactories::containsKey).findFirst();

    }

    private static DataValueTextRenderer getAttachedHTMLRenderer(final DataColumnSpec colSpec) {
        // TODO NOSONAR with UIEXT-2212, instead of using default renderer, use renderer selected in table
        var defaultRenderer = new SwingBasedRendererFactory().createDataValueRenderer(colSpec, null);
        if (defaultRenderer.getContentType() == DataCellContentType.HTML
            && defaultRenderer instanceof DataValueTextRenderer htmlRenderer) {
            return htmlRenderer;
        }
        return null;
    }

}
