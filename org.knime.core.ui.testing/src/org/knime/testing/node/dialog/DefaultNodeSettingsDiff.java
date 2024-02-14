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
 *   25 Jan 2024 (carlwitt): created
 */
package org.knime.testing.node.dialog;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.knime.core.node.NodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xmlunit.builder.DiffBuilder;
import org.xmlunit.diff.Comparison;
import org.xmlunit.diff.ComparisonFormatter;
import org.xmlunit.diff.ComparisonType;
import org.xmlunit.diff.DefaultComparisonFormatter;
import org.xmlunit.diff.Diff;
import org.xmlunit.diff.Difference;

/**
 * Serialize a {@link DefaultNodeSettings} to {@link NodeSettings} and from there to Xml. Compare the representations
 * and return differences.
 *
 * @author Carl Witt, KNIME AG, Zurich, Switzerland
 */
@SuppressWarnings("restriction")
final class DefaultNodeSettingsDiff {

    private static final ComparisonFormatter FORMATTER = new CustomFormatter();

    private final List<Difference> m_differences;

    private DefaultNodeSettingsDiff(final List<Difference> differences) {
        Objects.requireNonNull(differences,
            "Cannot instatiate " + getClass().getSimpleName() + " with a `null` difference list");
        m_differences = differences;
    }

    public boolean isEmpty() {
        return m_differences.isEmpty();
    }

    public String summary() {
        return m_differences.stream().map(d -> d.toString(FORMATTER)).collect(Collectors.joining("\n"));
    }

    /**
     * @param message prefix for the exception message. For instance "Test number 5 failed. "
     * @return a {@linkplain DifferencesFoundException} to throw
     */
    public DifferencesFoundException toException(final String message) {
        return new DifferencesFoundException(message, m_differences.size(), summary());
    }

    @SuppressWarnings("serial")
    public static class DifferencesFoundException extends Exception {
        public DifferencesFoundException(final String message, final int num_differences, final String summary) {
            super("%s%s differences found.%n%s".formatted(message, num_differences, summary));
        }
    }

    static DefaultNodeSettingsDiff of(final DefaultNodeSettings actual, final DefaultNodeSettings expected)
        throws ParserConfigurationException, SAXException, IOException {
        final var testDocument = fromSettings(expected); // somehow the order is exactly opposite of expected
        final var controlDocument = fromSettings(actual);
        return of(testDocument, controlDocument);
    }

    static DefaultNodeSettingsDiff of(final Document testDocument, final Document controlDocument) {
        return of(DiffBuilder.compare(controlDocument).withTest(testDocument).build());
    }

    /**
     * Most elements in settings.xml files have a key attribute that is helpful to understand the differences. The
     * default summary of a difference is
     *
     * <pre>
     * Expected attribute value 'false' but was 'true' - comparing <entry value="false"...>
     * at /config[1]/entry[13]/@value to <entry value="true"...> at /config[1]/entry[13]/@value (DIFFERENT)
     * </pre>
     *
     * Which basically just says it's a config/entry but without the key ("isUnixLines") it's not very telling.
     */
    private static final class CustomFormatter extends DefaultComparisonFormatter {
        @Override
        public String getDescription(final Comparison difference) {
            final ComparisonType type = difference.getType();
            String description = type.getDescription();
            final var controlDetails = difference.getControlDetails();
            final var controlTarget = controlDetails.getTarget();
            final var controlLocation = getShortString(controlTarget, controlDetails.getXPath(), type);
            final var testDetails = difference.getTestDetails();
            final var testTarget = testDetails.getTarget();
            final var testLocation = getShortString(testTarget, testDetails.getXPath(), type);

            if (type == ComparisonType.ATTR_NAME_LOOKUP) {
                return String.format("Expected %s '%s' - comparing %s to %s", description, controlDetails.getXPath(),
                    controlLocation, testLocation);
            }

            final var controlKey = getKey(type, controlTarget);
            final var testKey = getKey(type, testTarget);
            if (controlKey.isPresent() && controlKey.equals(testKey)) {
                description = "node setting '%s'".formatted(controlKey.get());
            }

            return String.format("Expected %s of %s to be '%s' but was '%s' - comparing %s to %s",
                type.getDescription(), description, getValue(controlDetails.getValue(), type),
                getValue(testDetails.getValue(), type), controlLocation, testLocation);
        }

        private static final String ENTRY = "entry";

        private static final String CONFIG = "config";

        /** @return e.g., {@code config[1, key=test]/entry[1, key=column]} */
        private static Optional<String> settingsElement(final Node node) {
            if (node == null) {
                return Optional.empty();
            }
            final var nodeName = node.getNodeName();
            if (CONFIG.equals(nodeName) || ENTRY.equals(nodeName)) {
                final var offset = indexOf(node);
                final var keyString = getKey(node).map(k -> ", key=" + k).orElse("");
                return Optional.of("%s[%d%s]".formatted(node.getNodeName(), offset, keyString));
            }
            return Optional.empty();
        }

        /** To get node settings keys in {@link #getShortString(Node, String, ComparisonType)} */
        @Override
        protected void appendElement(final StringBuilder sb, final Element aNode) {
            final var s = settingsElement(aNode);
            s.ifPresent(sb::append);
            if (s.isEmpty()) {
                super.appendElement(sb, aNode);
            }
        }

        /** To get node settings keys in {@link #getShortString(Node, String, ComparisonType)} */
        @Override
        protected void appendAttribute(final StringBuilder sb, final Attr attrNode) {
            final var s = settingsElement(attrNode.getOwnerElement());
            s.ifPresent(sb::append);
            if (s.isEmpty()) {
                super.appendAttribute(sb, attrNode);
            }
        }

        private static Optional<String> getKey(final Node node) {
            return getKey(null, node);
        }

        private static Optional<String> getKey(final ComparisonType type, final Node node) {
            return Optional.ofNullable(node) //
                .map(n -> type == ComparisonType.ATTR_VALUE ? ((Attr)n).getOwnerElement() : n) //
                .map(Node::getAttributes) //
                .map(attr -> attr.getNamedItem("key").getTextContent());
        }

        private static int indexOf(final Node node) {
            var parent = node.getParentNode();
            NodeList children = parent.getChildNodes();
            for (var i = 0; i < children.getLength(); i++) {
                if (children.item(i).equals(node)) {
                    return i;
                }
            }
            return -1; // Node not found
        }
    }

    static DefaultNodeSettingsDiff of(final Diff b) {
        return new DefaultNodeSettingsDiff(StreamSupport.stream(b.getDifferences().spliterator(), false).toList());
    }

    static String toXmlString(final DefaultNodeSettings settings) throws IOException {
        try (final var os = new ByteArrayOutputStream()) {
            final var toPersist = new NodeSettings("test");
            DefaultNodeSettings.saveSettings(settings.getClass(), settings, toPersist);
            toPersist.saveToXML(os);
            return os.toString(StandardCharsets.UTF_8.name());
        }
    }

    static Document fromString(final String xml) throws ParserConfigurationException, SAXException, IOException {
        final var factory = DocumentBuilderFactory.newInstance();
        final var builder = factory.newDocumentBuilder();
        final var is = new InputSource(new StringReader(xml));
        return builder.parse(is);
    }

    static Document fromSettings(final DefaultNodeSettings settings)
        throws ParserConfigurationException, SAXException, IOException {
        return fromString(toXmlString(settings));
    }

}
