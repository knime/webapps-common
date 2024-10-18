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

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.util.workflow.def.FallibleSupplier;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.PersistUtil;
import org.knime.core.webui.node.dialog.defaultdialog.UpdatesUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsSettingsImpl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * Creates the representation read by the frontend to generate the node dialog. In case the node has model and view
 * settings, the json forms of both are stored in one file.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @author Carl Witt, KNIME AG, Zurich, Switzerland
 */
@SuppressWarnings("restriction")
final class JsonFormsSnapshot extends Snapshot {

    private final int m_instance;

    private final Map<SettingsType, FallibleSupplier<DefaultNodeSettings>> m_settings;

    private final PortObjectSpec[] m_specs;

    /** Lazy initialized to avoid error handling during construction. */
    private JsonNode m_jsonForms;

    /**
     * @param testClassName
     * @param settings in case the node has model and view settings
     * @param specs to configure the settings
     * @throws JsonProcessingException
     */
    JsonFormsSnapshot(final int instance, final Map<SettingsType, FallibleSupplier<DefaultNodeSettings>> settings,
        final PortObjectSpec[] specs) {
        m_instance = instance;
        m_settings = settings;
        m_specs = specs;
    }

    @Override
    public String getFilename() {
        return m_testClassName + (m_instance == 0 ? "" : m_instance) + ".snap";
    }

    private static JsonNode jsonForms(final Map<SettingsType, FallibleSupplier<DefaultNodeSettings>> settings,
        final PortObjectSpec[] specs) throws JsonProcessingException {

        Map<SettingsType, DefaultNodeSettings> instances =
            settings.entrySet().stream().collect(Collectors.toMap(Entry::getKey, e -> {
                try {
                    return e.getValue().get();
                } catch (Exception ex) {
                    throw new IllegalStateException(
                        String.format("Exception while trying to write snapshot: %s", ex.getMessage()), ex);
                }
            }));

        // turn it into the json-forms representation
        final var context = DefaultNodeSettings.createDefaultNodeSettingsContext(specs);
        var jsonFormsSettings = new JsonFormsSettingsImpl(instances, context);
        var mapper = JsonFormsDataUtil.getMapper();
        var objectNode = mapper.createObjectNode();
        objectNode.set(JsonFormsConsts.FIELD_NAME_DATA, jsonFormsSettings.getData());
        objectNode.set(JsonFormsConsts.FIELD_NAME_SCHEMA, jsonFormsSettings.getSchema());
        objectNode.putRawValue(JsonFormsConsts.FIELD_NAME_UI_SCHEMA, jsonFormsSettings.getUiSchema(null));
        PersistUtil.constructTreesAndAddPersist(objectNode, instances);
        UpdatesUtil.constructTreesAndAddUpdates(objectNode, instances, context);
        return mapper.readTree(mapper.writeValueAsString(objectNode));
    }

    @Override
    public void writeGroundTruth(final Path snapshotFile) throws IOException {
        if (m_jsonForms == null) {
            m_jsonForms = jsonForms(m_settings, m_specs);
        }
        try {
            var jsonFormsString =
                JsonFormsDataUtil.getMapper().writerWithDefaultPrettyPrinter().writeValueAsString(m_jsonForms);
            Files.write(snapshotFile, jsonFormsString.getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(
                String.format("Exception while trying to write snapshot: %s", e.getMessage()), e);
        }
    }

    @Override
    public void compareWithSnapshotAndWriteDebugFile(final Path snapshotFile) throws IOException {
        if (m_jsonForms == null) {
            m_jsonForms = jsonForms(m_settings, m_specs);
        }
        var expectedJsonFormsString = Files.readString(snapshotFile, StandardCharsets.UTF_8);
        var debugFile = snapshotFile.getParent().resolve(getDebugFilename());
        try {
            assertThatJson(m_jsonForms).isEqualTo(JsonFormsDataUtil.getMapper().readTree(expectedJsonFormsString));
        } catch (AssertionError e) {
            // write debug file if snapshot doesn't match
            Files.writeString(debugFile,
                JsonFormsDataUtil.getMapper().writerWithDefaultPrettyPrinter().writeValueAsString(m_jsonForms),
                StandardCharsets.UTF_8);
            throw e;
        }
        if (Files.exists(debugFile)) {
            // if snapshot matches, delete debug file
            Files.delete(debugFile);
        }
    }
}
