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
 *   Jun 19, 2023 (hornm): created
 */
package org.knime.testing.node.dialog;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.eclipse.core.runtime.FileLocator;
import org.junit.jupiter.api.Test;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.util.FileUtil;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.osgi.framework.FrameworkUtil;

/**
 * <p>
 * Implemented by a junit test class in order run a snapshot-test on a {@link DefaultNodeSettings}-implementation. A
 * snapshot test computes a representation of a {@link DefaultNodeSettings} instance and makes sure that representation
 * does not change. For instance,
 * <ul>
 * <li>the node dialog (json forms)</li>
 * <li>the internal structure (node settings/xml)</li>
 * </ul>
 * </p>
 *
 * <p>
 * When the test is run for the first time, the snapshot files are created. The files are stored under
 * {@code files/test_snapshots} at the root of plugin/fragment where the implementing test is located. The directory
 * must be manually created before running the test for the first time.
 * </p>
 * <p>
 * Every successive run compares the newly determined outputs with the existing snapshot files. If those don't match,
 * the test will fail and a debug file is created with the current output (which then can be compared with the original
 * snapshot using a diff tool).
 * </p>
 *
 * <h2>Json Forms</h2>
 * <p>
 * The snapshot file (.snap) contains the json forms representation of the default node settings class as required by
 * the frontend (data, schema, ui-schema). Usually, this is a single {@link DefaultNodeSettings} instance. However, some
 * nodes have both model settings and view settings, in which case the snapshot contains the json forms for both. See
 * {@link JsonFormsSnapshot}
 * </p>
 *
 * <h2>Node Settings</h2>
 * <p>
 * Each snapshot file (.xml) contains the representation of one configuration. See {@link NodeSettingsSnapshot}.
 * </p>
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @author Carl Witt, KNIME AG, Zurich, Switzerland
 */
@SuppressWarnings("restriction")
public class DefaultNodeSettingsSnapshotTest {

    private static final String SNAPSHOT_FILE_LOCATION = "/files/test_snapshots";

    private final List<Snapshot> m_snapshotTests;

    /**
     * @param settingsClasses the default node settings classes to be tested
     * @param specs used to create an instance of the default node settings class
     */
    protected DefaultNodeSettingsSnapshotTest(
        final Map<SettingsType, Class<? extends DefaultNodeSettings>> settingsClasses, final PortObjectSpec... specs) {
        this(SnapshotTestConfiguration.builder() //
            .withInputPortObjectSpecs(specs) //
            .testJsonForms(settingsClasses).build());
    }

    /**
     * @param configuration defines the snapshot tests to run
     */
    protected DefaultNodeSettingsSnapshotTest(final SnapshotTestConfiguration configuration) {
        m_snapshotTests = configuration.m_snapshotTests;
        m_snapshotTests.forEach(st -> st.setBaseName(getClass().getName()));
    }

    /**
     * If a snapshot file exists, compares against its contents. If not, creates the file.
     *
     * @throws IOException
     */
    @Test
    protected void testSnapshot() throws IOException {
        for (var snapshot : m_snapshotTests) {
            // write the snapshot or compare with an existing snapshot
            var snapshotFile = getSnapshotPath(this.getClass()).resolve(snapshot.getFilename());
            if (Files.exists(snapshotFile)) {
                snapshot.compareWithSnapshotAndWriteDebugFile(snapshotFile);
            } else {
                snapshot.writeGroundTruth(snapshotFile);
            }
        }
    }

    /**
     * @param clazz defines the bundle to use as root
     * @return the snapshot file location, i.e., {@value DefaultNodeSettingsSnapshotTest#SNAPSHOT_FILE_LOCATION} in the
     *         root of the bundle that contains the test class
     * @throws IOException
     */
    public static Path getSnapshotPath(final Class<?> clazz) throws IOException {
        var url = FileLocator.toFileURL(resolveToURL(SNAPSHOT_FILE_LOCATION, clazz));
        return FileUtil.getFileFromURL(url).toPath();
    }

    /**
     * @param path defines the target location
     * @param clazz defines the bundle to use as root
     * @return the location as file URL
     * @throws IOException
     */
    private static URL resolveToURL(final String path, final Class<?> clazz) throws IOException {
        var bundle = FrameworkUtil.getBundle(clazz);
        var p = new org.eclipse.core.runtime.Path(path);
        var url = FileLocator.find(bundle, p, null);
        if (url == null) {
            throw new FileNotFoundException("Path " + path + " does not exist in bundle " + bundle.getSymbolicName());
        }
        return url;
    }

}
