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
 *   Sep 28, 2021 (hornm): created
 */
package org.knime.gateway.api.entity;

import java.util.List;
import java.util.Map;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataTableSpec;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeLogger;
import org.knime.core.node.util.CheckUtils;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.PageResourceManager.PageType;
import org.knime.core.webui.node.view.NodeViewManager;

/**
 * Node view entity containing the info required by the UI (i.e. frontend) to be able display a node view.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public final class NodeViewEnt extends NodeUIExtensionEnt<NodeWrapper> {

    private final NodeInfoEnt m_info;

    private List<String> m_initialSelection;

    private String m_generatedImageActionId;

    private Map<String, ColorModelEnt> m_colorModelsEnt;

    /**
     * @param nnc the Native node container to create the node view entity for
     * @param initialSelection the initial selection (e.g. a list of row keys or something else), supplied lazily (will
     *            not be called, if the node is not executed)
     * @param generatedImageActionId if the view is to be used for image generation, it specified a unique action-id
     *            used to communicate the image back to the java-side; {@code null} if this view is not used for image
     *            generation
     * @return a new instance
     */
    public static NodeViewEnt create(final NativeNodeContainer nnc, final Supplier<List<String>> initialSelection,
        final String generatedImageActionId) {
        return create(nnc, initialSelection, generatedImageActionId, generatedImageActionId != null);
    }

    private static NodeViewEnt create(final NativeNodeContainer nnc, final Supplier<List<String>> initialSelection,
        final String generatedImageActionId, final boolean isUsedForImageOrReportGeneration) {
        final var state = nnc.getNodeContainerState();
        if (state.isExecuted()
            || (generatedImageActionId != null && state.isExecutionInProgress() && !state.isWaitingToBeExecuted())) {
            try {
                NodeViewManager.getInstance().updateNodeViewSettings(nnc);
                return new NodeViewEnt(nnc, initialSelection, NodeViewManager.getInstance(), null,
                    generatedImageActionId, isUsedForImageOrReportGeneration);
            } catch (InvalidSettingsException ex) {
                NodeLogger.getLogger(NodeViewEnt.class).error("Failed to update node view settings", ex);
                return new NodeViewEnt(nnc, null, null, ex.getMessage(), generatedImageActionId,
                    isUsedForImageOrReportGeneration);
            }
        } else {
            return new NodeViewEnt(nnc, null, null, generatedImageActionId, null,
                isUsedForImageOrReportGeneration);
        }
    }

    /**
     * @param nnc the Native node container to create the node view entity for
     * @param initialSelection the initial selection (e.g. a list of row keys or something else), supplied lazily (will
     *            not be called, if the node is not executed)
     * @return a new instance
     */
    public static NodeViewEnt create(final NativeNodeContainer nnc, final Supplier<List<String>> initialSelection) {
        return create(nnc, initialSelection, null);
    }

    /**
     * @param nnc the Native node container to create the node view entity for
     * @param initialSelection the initial selection (e.g. a list of row keys or something else), supplied lazily (will
     *            not be called, if the node is not executed)
     * @param isUsedForReportGeneration indicates whether this view-ent is used for report generation
     * @return a new instance
     */
    public static NodeViewEnt create(final NativeNodeContainer nnc, final Supplier<List<String>> initialSelection,
        final boolean isUsedForReportGeneration) {
        boolean canBeUsedInReport = NodeViewManager.getInstance().canBeUsedInReport(nnc);
        // NOTE on the 'generatingReportContent'-constant:
        // this is a shortcut to inform the respective node view frontend that it's part of a report such that it can
        // optionally do things differently. It's a shortcut because this information is already provided to the frontend
        // via 'JSONWebNodePageConfiguration.getGeneratedReportActionId' such that the frontend could actually take care
        // of distributing the info to the individual views itself.
        return create(nnc, initialSelection,
            isUsedForReportGeneration && canBeUsedInReport ? "generatingReportContent" : null,
            isUsedForReportGeneration);
    }

    /**
     * Creates a new instances without a initial selection and without the underlying node being registered with the
     * selection event source.
     *
     * @param nnc the node to create the node view entity for
     * @return a new instance
     */
    public static NodeViewEnt create(final NativeNodeContainer nnc) {
        return create(nnc, null);
    }

    /**
     * Package scoped for testing purposes only
     */
    NodeViewEnt(final NativeNodeContainer nnc, final Supplier<List<String>> initialSelection,
        final NodeViewManager nodeViewManager, final String customErrorMessage, final String generatedImageActionId,
        final boolean isUsedForImageOrReportGeneration) {
        super(NodeWrapper.of(nnc), nodeViewManager.getPageResourceManager(), nodeViewManager.getDataServiceManager(),
            PageType.VIEW, isRunAsDesktopApplication() || isUsedForImageOrReportGeneration);
        CheckUtils.checkArgument(NodeViewManager.hasNodeView(nnc), "The provided node doesn't have a node view");
        m_initialSelection = initialSelection == null ? null : initialSelection.get();
        m_info = new NodeInfoEnt(nnc, customErrorMessage);
        m_generatedImageActionId = generatedImageActionId;
        final var spec = nodeViewManager.getInputDataTableSpecIfTableView(nnc).orElse(null);
        if (spec != null) {
            m_colorModelsEnt = getColorHandlerColumns(spec);
        }
    }

    /**
     *
     * @return a map from the name of a column to its attached color model
     */
    private static Map<String, ColorModelEnt> getColorHandlerColumns(final DataTableSpec spec) {
        return spec.stream().filter(colSpec -> colSpec.getColorHandler() != null).collect(
            Collectors.toMap(DataColumnSpec::getName, col -> new ColorModelEnt(col.getColorHandler().getColorModel())));
    }

    /**
     * @return additional info for the node providing the view
     */
    public NodeInfoEnt getNodeInfo() {
        return m_info;
    }

    /**
     * @return the initial selection (e.g. a list of row keys)
     */
    public List<String> getInitialSelection() {
        return m_initialSelection;
    }

    /**
     * If the view represented by this view entity is used for the purpose of image or report generation via an image or
     * report output port. In case of image generation
     * <ul>
     * <li>this action-id is used to uniquely communicate the image back to the java-side</li>
     * <li>indicates that the node view may already be generated while the node is in executing state</li>
     * </ul>
     * In case of report generation, the (absence/presence) of the id is used as indication whether this view is able to
     * generate a report (i.e. can contribute to the report).
     *
     * In both cases (report and image generation) the presence of this property also indicates that support for any
     * kind of interactivity is not needed.
     *
     * TODO report and image generation properties should be separated as part of UIEXT-1031
     *
     * @return the action-id or {@code null} if view is not used for image generation nor report generation
     */
    public String getGeneratedImageActionId() {
        return m_generatedImageActionId;
    }

    /**
     * @return the representation to the color model to be used by the frontend to translate numeric or nominal values
     *         to hex colors. Can be null if no color model was provided.
     */
    public Map<String, ColorModelEnt> getColorModels() {
        return m_colorModelsEnt;
    }

}
