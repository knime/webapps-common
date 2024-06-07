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
 *   Jun 7, 2024 (hornm): created
 */
package org.knime.core.webui.node.dialog.configmapping;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import org.knime.core.node.NodeSettings;

/**
 * A list of strings used to index {@link NodeSettings}
 *
 * @author Paul Bärnreuther
 */
public final class ConfigPath {

    private final List<String> m_path;

    private int size() {
        return m_path.size();
    }

    /**
     * @return the underlying path as a list
     */
    public List<String> path() {
        return m_path;
    }

    /**
     * @param path
     */
    public ConfigPath(final List<String> path) {
        m_path = new ArrayList<>(path);
    }

    ConfigPath withoutLastKey() {
        return new ConfigPath(m_path.subList(0, size() - 1));
    }

    ConfigPath withoutFirstKey() {
        return new ConfigPath(m_path.subList(1, size()));
    }

    /**
     * @param basePath
     * @return whether the path starts with the basePath
     *
     */
    boolean startsWith(final ConfigPath basePath) {
        if (basePath.m_path.size() > m_path.size()) {
            return false;
        }
        return IntStream.range(0, basePath.size()).allMatch(i -> basePath.m_path.get(i).equals(m_path.get(i)));
    }

    @Override
    public boolean equals(final Object obj) {
        if (obj instanceof ConfigPath other) {
            return m_path.equals(other.m_path);
        }
        return false;
    }

    @Override
    public int hashCode() {
        return m_path.hashCode();
    }

    /**
     *
     * @param basePath
     * @return the NodeSettingsPath relative to the given basePath
     *
     * @throws IllegalArgumentException if the path does not start with the basePath.
     */
    ConfigPath relativize(final ConfigPath basePath) {
        if (basePath.size() == 0) {
            return this;
        }
        if (!basePath.firstKey().equals(firstKey())) {
            throw new IllegalArgumentException(
                String.format("Unable to relativice since \"%s\" is not \"%s\".", basePath.firstKey(), firstKey()));
        }
        return this.withoutFirstKey().relativize(basePath.withoutFirstKey());
    }

    String firstKey() {
        return m_path.get(0);
    }

    String lastKey() {
        return m_path.get(size() - 1);
    }

    /**
     * @param key that should be appended
     * @return a new configPath
     */
    ConfigPath plus(final String key) {
        return new ConfigPath(Stream.concat(m_path.stream(), Stream.of(key)).toList());
    }
}
