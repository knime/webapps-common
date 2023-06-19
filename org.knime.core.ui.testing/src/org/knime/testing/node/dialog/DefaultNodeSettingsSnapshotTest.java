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

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.eclipse.core.runtime.FileLocator;
import org.junit.jupiter.api.Test;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsSettingsImpl;
import org.osgi.framework.FrameworkUtil;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * <p>
 * Implemented by a junit test class in order run a snapshot-test on a {@link DefaultNodeSettings}-implementation.
 * </p>
 *
 * <p>
 * When the test is run for the very first time, the snapshot-file (.snap) is created. It contains the
 * jsonforms-representation (json-string) of the default node settings-class as required by the frontend (data, schema,
 * ui-schema). Every successive run compares the newly determined string-representation with the snapshot file. If those
 * don't match, the test will fail and a debug-file (.snap.debug) is created with the current result (which then can be
 * compared with the original snapshot using a diff tool).
 * </p>
 *
 * <p>
 * The snapshot is stored at {@code files/test_snapshots} at the root of plugin/fragment where the implementing test is
 * located. The directory must be manually created before running the test for the first time.
 * </p>
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public class DefaultNodeSettingsSnapshotTest {

    private final PortObjectSpec[] m_specs;

    private final Map<SettingsType, Class<? extends DefaultNodeSettings>> m_settingsClasses;

    /**
     * @param settingsClasses the default node settings classes to be tested
     * @param specs used to create an instance of the default node settings class
     */
    protected DefaultNodeSettingsSnapshotTest(
        final Map<SettingsType, Class<? extends DefaultNodeSettings>> settingsClasses, final PortObjectSpec... specs) {
        m_settingsClasses = settingsClasses;
        m_specs = specs;
    }

    @Test
    void testSnapshot() throws IOException {
        // create an instance of the settings-class and save to node settings
        var settingsObjects = m_settingsClasses.entrySet().stream().map(e -> {
            var nodeSettings = new NodeSettings("ignore");
            var settingsObj = DefaultNodeSettings.createSettings(e.getValue(), m_specs);
            DefaultNodeSettings.saveSettings(e.getValue(), settingsObj, nodeSettings);
            return Map.entry(e.getKey(), settingsObj);
        }).collect(Collectors.toMap(Entry::getKey, Entry::getValue));

        // turn it into the json-forms representation
        var jsonFormsSettings =
            new JsonFormsSettingsImpl(settingsObjects, DefaultNodeSettings.createSettingsCreationContext(m_specs));
        var mapper = JsonFormsDataUtil.getMapper();
        var objectNode = mapper.createObjectNode();
        objectNode.set(JsonFormsConsts.FIELD_NAME_DATA, jsonFormsSettings.getData());
        objectNode.set(JsonFormsConsts.FIELD_NAME_SCHEMA, jsonFormsSettings.getSchema());
        objectNode.putRawValue(JsonFormsConsts.FIELD_NAME_UI_SCHEMA, jsonFormsSettings.getUiSchema());
        var jsonForms = mapper.readTree(mapper.writeValueAsString(objectNode));

        // write the snapshot or compare with an existing snapshot
        var snapshotFile = getSnapshotPath(this.getClass()).resolve(getSnapshotFileName());
        if (Files.exists(snapshotFile)) {
            compareWithSnapshotAndWriteDebugFile(jsonForms, snapshotFile);
        } else {
            writeSnapshotFile(jsonForms, snapshotFile);
        }
    }

    private static void writeSnapshotFile(final JsonNode jsonForms, final Path snapshotFile) throws IOException {
        try {
            var jsonFormsString =
                JsonFormsDataUtil.getMapper().writerWithDefaultPrettyPrinter().writeValueAsString(jsonForms);
            Files.write(snapshotFile, jsonFormsString.getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(
                String.format("Exception while trying to write snapshot: %s", e.getMessage()), e);
        }
    }

    private void compareWithSnapshotAndWriteDebugFile(final JsonNode jsonForms, final Path snapshotFile)
        throws IOException {
        var expectedJsonFormsString = Files.readString(snapshotFile, StandardCharsets.UTF_8);
        var debugFile = snapshotFile.getParent().resolve(getSnapshotFileName() + ".debug");
        try {
            assertThatJson(jsonForms).isEqualTo(JsonFormsDataUtil.getMapper().readTree(expectedJsonFormsString));
        } catch (AssertionError e) {
            // write debug file if snapshot doesn't match
            Files.writeString(debugFile, expectedJsonFormsString, StandardCharsets.UTF_8);
            throw e;
        }
        if (Files.exists(debugFile)) {
            // if snapshot matches, delete debug file
            Files.delete(debugFile);
        }
    }

    private String getSnapshotFileName() {
        return getClass().getName() + ".snap";
    }

    private static Path getSnapshotPath(final Class<?> clazz) throws IOException {
        var url = FileLocator.toFileURL(resolveToURL("/files/test_snapshots", clazz));
        return Paths.get(url.getPath());
    }

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
