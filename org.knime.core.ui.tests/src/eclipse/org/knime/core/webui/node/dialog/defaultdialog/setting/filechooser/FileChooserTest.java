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

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.stream.Stream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.knime.filehandling.core.connections.FSCategory;
import org.knime.filehandling.core.connections.FSLocation;
import org.knime.filehandling.core.connections.RelativeTo;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;

/**
 * @author Paul Bärnreuther
 */
@SuppressWarnings({"unused", "java:S2698"}) // we accept assertions without messages
public class FileChooserTest {

    ObjectMapper objectMapper;

    @BeforeEach
    void createObjectMapper() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new Jdk8Module());
        objectMapper.setSerializationInclusion(Include.NON_NULL);
        objectMapper.setVisibility(PropertyAccessor.ALL, Visibility.NON_PRIVATE);
        final var module = new SimpleModule();
        FSLocationJsonSerializationUtil.addSerializerAndDeserializer(module);
        objectMapper.registerModule(module);
    }

    @Test
    void testSerializeDefault() {
        class TestSettings {
            FileChooser fileChooser = new FileChooser();
        }
        final var result = objectMapper.valueToTree(new TestSettings());
        assertThatJson(result).inPath("fileChooser.path.path").isString().isEqualTo("");//
        assertThatJson(result).inPath("fileChooser.path.fsCategory").isString().isEqualTo("LOCAL");
        assertThatJson(result).inPath("fileChooser.path.timeout").isIntegralNumber().isEqualTo(10000);

    }

    @Test
    void testSerializeCustomURL() {
        class TestSettings {
            FileChooser fileChooser = new FileChooser(new FSLocation(FSCategory.CUSTOM_URL, "1", "myPath"));
        }
        final var result = objectMapper.valueToTree(new TestSettings());
        assertThatJson(result).inPath("fileChooser.path.path").isString().isEqualTo("myPath");//
        assertThatJson(result).inPath("fileChooser.path.fsCategory").isString().isEqualTo("CUSTOM_URL");
        assertThatJson(result).inPath("fileChooser.path.timeout").isIntegralNumber().isEqualTo(1);

    }

    @Test
    void testSerializeNonSupportedFSLocation() {
        class TestSettings {
            FileChooser fileChooser = new FileChooser(new FSLocation(FSCategory.MOUNTPOINT, "specifier", "myPath"));
        }
        final var result = objectMapper.valueToTree(new TestSettings());
        assertThatJson(result).inPath("fileChooser.path.path").isString().isEqualTo("myPath");//
        assertThatJson(result).inPath("fileChooser.path.fsCategory").isString().isEqualTo("MOUNTPOINT");
        assertThatJson(result).inPath("fileChooser.path.context.fsSpecifier").isString().isEqualTo("specifier");
        assertThatJson(result).inPath("fileChooser.path.context.fsToString").isString()
            .isEqualTo("(MOUNTPOINT, specifier, myPath)");
    }

    static class DeserializationTestSettings {

        DeserializationTestSettings() {
        }

        DeserializationTestSettings(final FSLocation fsLocation) {
            fileChooser = new FileChooser(fsLocation);
        }

        FileChooser fileChooser = new FileChooser();
    }

    @Test
    void testDeserializeDefault() throws JsonProcessingException, IllegalArgumentException {
        final var testSettings = new DeserializationTestSettings();
        final var result = objectMapper.valueToTree(new DeserializationTestSettings());
        final var deserialized = objectMapper.treeToValue(result, DeserializationTestSettings.class);
        assertThat(testSettings.fileChooser).isEqualTo(deserialized.fileChooser);

    }

    static Stream<Arguments> fsLocations() {
        return Stream.of( //
            Arguments.of(new FSLocation(FSCategory.LOCAL, "myPath")), //
            Arguments.of(new FSLocation(FSCategory.CUSTOM_URL, "1", "myPath")), //
            Arguments.of(new FSLocation(FSCategory.MOUNTPOINT, "mountpointSpecifier", "myPath")), //
            Arguments.of(new FSLocation(FSCategory.RELATIVE, RelativeTo.SPACE.getSettingsValue(), "myPath")), //
            Arguments.of(new FSLocation(FSCategory.HUB_SPACE, "myPath")), //
            Arguments.of(new FSLocation(FSCategory.CONNECTED, "myPath")));
    }

    @ParameterizedTest
    @MethodSource("fsLocations")
    void testDeserializeCustomFSLocation(final FSLocation fsLocation)
        throws JsonProcessingException, IllegalArgumentException {
        final var testSettings = new DeserializationTestSettings(fsLocation);
        final var result = objectMapper.valueToTree(testSettings);
        final var deserialized = objectMapper.treeToValue(result, DeserializationTestSettings.class);
        assertThat(testSettings.fileChooser).isEqualTo(deserialized.fileChooser);

    }

}
