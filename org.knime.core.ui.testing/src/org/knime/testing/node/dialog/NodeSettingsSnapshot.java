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
 *   24 Jan 2024 (carlwitt): created
 */
package org.knime.testing.node.dialog;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

import org.knime.core.node.NodeSettings;
import org.knime.core.util.workflow.def.FallibleSupplier;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;

import com.fasterxml.jackson.core.JsonProcessingException;

/**
 * Creates the internal settings structure {@link NodeSettings} used to persist the settings.
 *
 * @author Carl Witt, KNIME AG, Zurich, Switzerland
 */
@SuppressWarnings("restriction")
final class NodeSettingsSnapshot extends Snapshot {

    private final int m_instance;

    private final FallibleSupplier<? extends DefaultNodeSettings> m_assertion;

    /**
     * @param assertion in case the node has model and view settings
     * @throws JsonProcessingException
     */
    NodeSettingsSnapshot(final int instance, final FallibleSupplier<? extends DefaultNodeSettings> assertion) {
        m_instance = instance;
        m_assertion = assertion;
    }

    @Override
    public String getFilename() {
        return m_testClassName + m_instance + ".settings.xml.snap";
    }

    @Override
    public void writeGroundTruth(final Path snapshotFile) throws IOException {
        try {
            final var settings = m_assertion.get();
            final var toPersist = new NodeSettings("test");
            DefaultNodeSettings.saveSettings(settings.getClass(), settings, toPersist);
            try (final var os = Files.newOutputStream(snapshotFile, StandardOpenOption.CREATE)) {
                toPersist.saveToXML(os);
            }
        } catch (Exception e) {
            throw new IllegalStateException(
                String.format("Exception while trying to write snapshot: %s", e.getMessage()), e);
        }
    }

    @Override
    public void compareWithSnapshotAndWriteDebugFile(final Path snapshotFile) throws IOException {
        try {
            // previous state
            var controlXmlString = Files.readString(snapshotFile, StandardCharsets.UTF_8);
            final var controlDocument = DefaultNodeSettingsDiff.fromString(controlXmlString);

            // current state
            final var settings = m_assertion.get();
            final var testDocument = DefaultNodeSettingsDiff.fromSettings(settings);

            // write or clean up debug file
            final var debugFile = snapshotFile.getParent().resolve(getDebugFilename());
            final var diff = DefaultNodeSettingsDiff.of(testDocument, controlDocument);
            if (!diff.isEmpty()) {
                // write debug file if snapshot doesn't match
                Files.writeString(debugFile, controlXmlString, StandardCharsets.UTF_8);
                throw diff.toException(
                    "Generated node settings do not match snapshot file contents at %s%nDebug file written to %s"
                        .formatted(snapshotFile, debugFile));
            } else if (Files.exists(debugFile)) {
                // if snapshot matches, delete debug file
                Files.delete(debugFile);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
