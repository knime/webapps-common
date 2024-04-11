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
 *   Apr 11, 2024 (hornm): created
 */
package org.knime.core.ui.workflowcoach.data;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.eclipse.core.runtime.preferences.DefaultScope;
import org.knime.core.node.NodeFrequencies;
import org.knime.core.node.NodeLogger;
import org.knime.core.node.NodeTriple;
import org.osgi.framework.FrameworkUtil;

/**
 * Gets the node triples for node recommendations from a file referenced via a eclipse preference. That way it can be
 * provided via 'customization profiles'.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public class PrefsTripleProvider implements NodeTripleProvider {

    private static final String PREF_KEY_NODE_RECOMMENDATIONS_FILE_PATH =
        "knime.core.ui.node-recommendations-file-path";

    /**
     * Creates {@link PrefsTripleProvider} instances.
     */
    public static class Factory implements NodeTripleProviderFactory {

        @Override
        public List<NodeTripleProvider> createProviders() {
            return List.of(new PrefsTripleProvider());
        }

        @Override
        public String getPreferencePageID() {
            return null;
        }
    }

    private final Path m_file;

    @SuppressWarnings("javadoc")
    public PrefsTripleProvider() {
        var filePath =
            DefaultScope.INSTANCE.getNode(FrameworkUtil.getBundle(PrefsTripleProvider.class).getSymbolicName())
                .get(PREF_KEY_NODE_RECOMMENDATIONS_FILE_PATH, null);
        if (StringUtils.isBlank(filePath)) {
            m_file = null;
        } else {
            Path file = null;
            try {
                file = Path.of(filePath);
                var allGood = Files.exists(file) && Files.isRegularFile(file) && Files.isReadable(file);
                if (!allGood) {
                    file = null;
                    NodeLogger.getLogger(getClass())
                        .warn("Node recommendations file at path '%' doesn't exist or is not readable.");
                }
            } catch (InvalidPathException e) {
                NodeLogger.getLogger(getClass()).warn("Invalid path to read node recommendations from: " + filePath, e);
            }
            m_file = file;
        }
    }

    @Override
    public String getName() {
        return "Preferences";
    }

    @Override
    public String getDescription() {
        return "Node recommendations configured via preferences.";
    }

    @Override
    public boolean isEnabled() {
        return m_file != null;
    }

    @Override
    public Stream<NodeTriple> getNodeTriples() throws IOException {
        try (final var inStream = Files.newInputStream(m_file)) {
            return NodeFrequencies.from(inStream).getFrequencies().stream();
        }
    }

    @Override
    public Optional<LocalDateTime> getLastUpdate() {
        if (m_file != null) {
            try {
                return Optional
                    .of(LocalDateTime.ofInstant(Files.getLastModifiedTime(m_file).toInstant(), ZoneId.systemDefault()));
            } catch (IOException ex) {
                NodeLogger.getLogger(getClass())
                    .warn("Could not determine last update of '" + m_file + "': " + ex.getMessage(), ex);
                return Optional.empty();
            }
        } else {
            return Optional.empty();
        }
    }

}
