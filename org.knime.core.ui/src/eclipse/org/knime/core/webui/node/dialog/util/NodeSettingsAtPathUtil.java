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
 *   May 12, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.util;

import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.config.base.AbstractConfigEntry;

/**
 * A utility class for modifying node settings at paths, i.e. arrays of config keys)
 *
 * @author Paul Bärnreuther
 */
public class NodeSettingsAtPathUtil {

    private NodeSettingsAtPathUtil() {
        // Utility
    }

    /**
     * @param settings
     * @param path
     * @return true if the full path exists in the given settings. Hereby the last key does not have to give rise to
     *         {@link NodeSettings} but could index e.g. a string value instead.
     */
    public static boolean hasPath(final NodeSettingsRO settings, final String[] path) {
        return getNodeSettingsROAtPath(settings, withoutFinalKey(path))
            .map(ns -> getSettingsChildByKey(ns, finalKey(path))).orElse(null) != null;
    }

    /**
     * @param settings that are to be partially replaced
     * @param path at which the settings are to be replaced by the other settings at that path
     * @param other the other settings by which to replace
     *            <p>
     *            Edge cases:
     *            <ul>
     *            <li>settings does not contain the path: In this case we leave out the parts of the path which are not
     *            present.</li>
     *            <li>other does not contain the path: In this case we do nothing.</li>
     *            </ul>
     *            </p>
     */
    public static void replaceAtPathIfPresent(final NodeSettings settings, final String[] path,
        final NodeSettingsRO other) {
        var subSettings = settings;
        var subSettingsPrev = other;
        for (var key : withoutFinalKey(path)) {
            final var subSettingsCandidate = getNodeSettingsAtKey(subSettings, key);
            final var subSettingsPrevCandidate = getNodeSettingsROAtKey(subSettingsPrev, key);
            if (subSettingsPrevCandidate.isEmpty()) {
                return;
            }
            if (subSettingsCandidate.isEmpty()) {
                subSettings.addEntry((AbstractConfigEntry)subSettingsPrevCandidate.get());
                return;
            }
            subSettings = subSettingsCandidate.get();
            subSettingsPrev = subSettingsPrevCandidate.get();
        }
        final var entry = getSettingsChildByKey(subSettingsPrev, finalKey(path));
        if (entry != null) {
            subSettings.addEntry(entry);
        }
    }

    /**
     *
     * Deletes the entry of the settings at the path if present.
     *
     * @param settings
     * @param path
     */
    public static void deletePath(final NodeSettings settings, final String[] path) {
        getNodeSettingsAtPath(settings, withoutFinalKey(path))
            .ifPresent(atPath -> atPath.removeConfig(finalKey(path)));
    }

    private static Optional<NodeSettings> getNodeSettingsAtKey(final NodeSettings nodeSettings, final String key) {
        if (getSettingsChildByKey(nodeSettings, key) instanceof NodeSettings ns) {
            return Optional.of(ns);
        }
        return Optional.empty();
    }

    private static Optional<NodeSettings> getNodeSettingsAtPath(final NodeSettings nodeSettings,
        final List<String> path) {
        var result = Optional.of(nodeSettings);
        for (var key : path) {
            result = result.flatMap(s -> getNodeSettingsAtKey(s, key));
        }
        return result;
    }

    private static Optional<NodeSettingsRO> getNodeSettingsROAtKey(final NodeSettingsRO nodeSettings,
        final String key) {
        if (getSettingsChildByKey(nodeSettings, key) instanceof NodeSettingsRO ns) {
            return Optional.of(ns);
        }
        return Optional.empty();
    }

    private static Optional<NodeSettingsRO> getNodeSettingsROAtPath(final NodeSettingsRO nodeSettings,
        final List<String> path) {
        var result = Optional.of(nodeSettings);
        for (var key : path) {
            result = result.flatMap(s -> getNodeSettingsROAtKey(s, key));
        }
        return result;
    }

    private static List<String> withoutFinalKey(final String[] path) {
        return IntStream.range(0, path.length - 1).mapToObj(i -> path[i]).toList();
    }

    private static String finalKey(final String[] path) {
        return path[path.length - 1];
    }

    /**
     * Helper method to get a child of arbitrary type by its key / name
     */
    private static AbstractConfigEntry getSettingsChildByKey(final NodeSettingsRO settings, final String key) {
        for (var i = 0; i < settings.getChildCount(); i++) {
            var treeNode = settings.getChildAt(i);
            if (!(treeNode instanceof AbstractConfigEntry)) {
                continue; // unexpected (yet not unrecoverable) state: setting should be of type AbstractConfigEntry
            }
            var ace = (AbstractConfigEntry)treeNode;
            if (ace.getKey().equals(key)) {
                return ace;
            }
        }
        return null;
    }

}
