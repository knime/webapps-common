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
 *   Jan 13, 2023 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.fileselection;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeLogger;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.NodeSettingsPersistorWithConfigKey;
import org.knime.filehandling.core.data.location.FSLocationSerializationUtils;
import org.knime.filehandling.core.defaultnodesettings.filechooser.reader.SettingsModelReaderFileChooser;

/**
 * {@link NodeSettingsPersistor} for {@link FileSelection} that persists it in a way compatible to
 * {@link SettingsModelReaderFileChooser}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public final class LegacyReaderFileSelectionPersistor extends NodeSettingsPersistorWithConfigKey<FileSelection> {

    private static final NodeLogger LOGGER = NodeLogger.getLogger(LegacyReaderFileSelectionPersistor.class);

    @SuppressWarnings("javadoc")
    public static FileSelection load(final NodeSettingsRO nodeSettings, final String configKey)
        throws InvalidSettingsException {
        var fileChooserSettings = nodeSettings.getNodeSettings(configKey);
        var fileChooser = new FileSelection();
        fileChooser.m_path = FSLocationSerializationUtils.loadFSLocation(fileChooserSettings.getConfig("path"));
        return fileChooser;
    }


    @SuppressWarnings("javadoc")
    public static void save(FileSelection fileChooser, final NodeSettingsWO settings, final String configKey) {
        if (fileChooser == null) {
            LOGGER.coding(createFilterNullError(configKey));
            fileChooser = new FileSelection();
        }
        var fileChooserSettings = settings.addNodeSettings(configKey);
        FSLocationSerializationUtils.saveFSLocation(fileChooser.getFSLocation(),
            fileChooserSettings.addNodeSettings("path"));

        var filterMode = fileChooserSettings.addNodeSettings("filter_mode");
        filterMode.addString("filter_mode", "FILE");
        filterMode.addBoolean("include_subfolders", false);

        var filterOptions = filterMode.addNodeSettings("filter_options");
        filterOptions.addBoolean("filter_files_extension", false);
        filterOptions.addString("files_extension_expression", "");
        filterOptions.addBoolean("files_extension_case_sensitive", false);
        filterOptions.addBoolean("filter_files_name", false);
        filterOptions.addString("files_name_expression", "*");
        filterOptions.addBoolean("files_name_case_sensitive", false);
        filterOptions.addString("files_name_filter_type", "WILDCARD");
        filterOptions.addBoolean("include_hidden_files", false);
        filterOptions.addBoolean("include_special_files", true);
        filterOptions.addBoolean("filter_folders_name", false);
        filterOptions.addString("folders_name_expression", "*");
        filterOptions.addBoolean("folders_name_case_sensitive", false);
        filterOptions.addString("folders_name_filter_type", "WILDCARD");
        filterOptions.addBoolean("include_hidden_folders", false);
        filterOptions.addBoolean("follow_links", true);

        var fileSystemChooserInternals = fileChooserSettings.addNodeSettings("file_system_chooser__Internals");
        fileSystemChooserInternals.addBoolean("has_fs_port", false);
        fileSystemChooserInternals.addBoolean("overwritten_by_variable", false);
        fileSystemChooserInternals.addString("convenience_fs_category", "RELATIVE");
        fileSystemChooserInternals.addString("relative_to", "knime.workflow");
        fileSystemChooserInternals.addString("mountpoint", "LOCAL");
        fileSystemChooserInternals.addString("spaceId", "");
        fileSystemChooserInternals.addString("spaceName", "");
        fileSystemChooserInternals.addInt("custom_url_timeout", 1000);
        fileSystemChooserInternals.addBoolean("connected_fs", true);
    }

    // TODO
    private static String createFilterNullError(final String configKey) {
        var nodeContext = NodeContext.getContext();
        String prefix;
        if (nodeContext != null) {
            prefix = String.format("The ColumnFilter with key '%s' of the node '%s' is null.", configKey,
                nodeContext.getNodeContainer().getNameWithID());
        } else {
            prefix = String.format("The ColumnFilter with key '%s' is null. ", configKey);
        }
        return prefix
            + " It is replaced by a new ColumnFilter instance to prevent errors but please fix this issue anyway.";
    }

    @Override
    public FileSelection load(final NodeSettingsRO settings) throws InvalidSettingsException {
        return load(settings, getConfigKey());
    }

    @Override
    public void save(final FileSelection obj, final NodeSettingsWO settings) {
        save(obj, settings, getConfigKey());
    }
}
