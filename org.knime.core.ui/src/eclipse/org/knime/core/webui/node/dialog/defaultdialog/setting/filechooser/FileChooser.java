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
 *   Nov 3, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.filechooser;

import java.util.Objects;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistorWithConfigKey;
import org.knime.filehandling.core.connections.FSCategory;
import org.knime.filehandling.core.connections.FSLocation;

/**
 * This settings class can be used to display a dropdown from which several file system categories can be selected
 * (currently only local and custom/KNIME URLs). Depending on the selected value, other input fields for the respective
 * selected file system category appear.
 *
 * @author Paul Bärnreuther
 */
public final class FileChooser {

    String m_path;

    FSCategory m_fsCategory;

    static final int DEFAULT_TIMEOUT = 1000;

    int m_timeout = DEFAULT_TIMEOUT;

    /**
     * A local file chooser
     */
    public FileChooser() {
        this(new FSLocation(FSCategory.LOCAL, ""));
    }

    /**
     * A file chooser representing the given {@link FSLocation}.
     *
     * @param fsLocation
     */
    public FileChooser(final FSLocation fsLocation) {
        m_path = fsLocation.getPath();
        m_fsCategory = fsLocation.getFSCategory();
        if (m_fsCategory == FSCategory.CUSTOM_URL) {
            m_timeout = fsLocation.getFileSystemSpecifier().map(Integer::valueOf).orElseThrow();
        }
    }

    FSLocation toFSLocation() {
        if (m_fsCategory == FSCategory.LOCAL) {
            return new FSLocation(m_fsCategory, m_path);
        }
        return new FSLocation(m_fsCategory, Integer.toString(m_timeout), m_path);
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final var other = (FileChooser)obj;
        return Objects.equals(m_path, other.m_path) && Objects.equals(m_fsCategory, other.m_fsCategory)
            && Objects.equals(m_timeout, other.m_timeout);
    }

    @Override
    public int hashCode() {
        return Objects.hash(m_path, m_timeout, m_fsCategory);
    }

    /**
     * This is the default persistor used for fields of type {@link FileChooser}. It saves and loads the field by
     * transforming it to a {@link FSLocation} and persisting that instead.
     *
     * @author Paul Bärnreuther
     */
    public static final class DefaultPersistor extends NodeSettingsPersistorWithConfigKey<FileChooser> {

        @Override
        public FileChooser load(final NodeSettingsRO settings) throws InvalidSettingsException {
            final var fsLocation =
                FSLocationSerializationUtils2.loadFSLocation(settings.getNodeSettings(getConfigKey()));
            return new FileChooser(fsLocation);
        }

        @Override
        public void save(final FileChooser fileChooser, final NodeSettingsWO settings) {
            FSLocationSerializationUtils2.saveFSLocation(fileChooser.toFSLocation(),
                settings.addNodeSettings(getConfigKey()));
        }

    }

}
