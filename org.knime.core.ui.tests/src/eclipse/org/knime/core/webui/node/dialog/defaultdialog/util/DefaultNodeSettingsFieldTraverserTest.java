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
 *   Jun 16, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.util;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.layout.LayoutGroup;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings({"unused", "java:S2698"}) // We allow unused settings in the dummy settings. we accept assertions without messages
class DefaultNodeSettingsFieldTraverserTest {

    static DefaultNodeSettingsFieldTraverser getTraverser(final Class<?> settingsClass) {
        return new DefaultNodeSettingsFieldTraverser(JsonFormsDataUtil.getMapper(), settingsClass);
    }

    @Test
    void testTraversal() throws JsonProcessingException {

        class ClusterOfSettings implements LayoutGroup {
            String m_sub1;

            String m_sub2;
        }

        class ControlSetting {
            String m_sub1;

            String m_sub2;
        }

        class TestControlSettings implements DefaultNodeSettings {
            String m_normalSetting;

            ClusterOfSettings m_settingWithNestedUiElements;

            ControlSetting m_customSetting;
        }

        final var traverser = getTraverser(TestControlSettings.class);
        final List<List<String>> paths = new ArrayList<>(0);
        final List<PropertyWriter> fields = new ArrayList<>(0);
        traverser.traverse(field -> {
            fields.add(field.propertyWriter());
            paths.add(field.path());
        });
        assertThat(fields).hasSize(4);
        assertThat(fields.get(0).getName()).isEqualTo("normalSetting");
        assertThat(paths.get(0)).hasSize(1);
        assertThat(paths.get(0).get(0)).isEqualTo("normalSetting");
        assertThat(fields.get(1).getName()).isEqualTo("sub1");
        assertThat(paths.get(1)).hasSize(2);
        assertThat(paths.get(1).get(0)).isEqualTo("settingWithNestedUiElements");
        assertThat(paths.get(1).get(1)).isEqualTo("sub1");
        assertThat(fields.get(2).getName()).isEqualTo("sub2");
        assertThat(paths.get(2)).hasSize(2);
        assertThat(paths.get(2).get(0)).isEqualTo("settingWithNestedUiElements");
        assertThat(paths.get(2).get(1)).isEqualTo("sub2");
        assertThat(fields.get(3).getName()).isEqualTo("customSetting");
        assertThat(paths.get(3)).hasSize(1);
        assertThat(paths.get(3).get(0)).isEqualTo("customSetting");
    }

    @Nested
    class AnnotationsTraversal {

        @Retention(RetentionPolicy.RUNTIME)
        @interface TestId {
            int value() default -1;
        }

        @Test
        void testDoesNotTrackAnnotationsIfNoneProvided() {
            class TestAnnotationSettings implements DefaultNodeSettings {

                @TestId(2)
                String m_sectionSetting;
            }

            final var traverser = getTraverser(TestAnnotationSettings.class);
            final List<Optional<TestId>> ids = new ArrayList<>(0);
            traverser.traverse(field -> {
                ids.add(field.trackedAnnotations().getInstance(TestId.class));
            }, Collections.emptyList());
            assertThat(ids).hasSize(1);
            assertThat(ids.get(0)).isEmpty();
        }

        @Retention(RetentionPolicy.RUNTIME)
        @interface TestId2 {
            int value();
        }

        @Test
        void testOnlyTracksRegisteredAnnotations() {


            class TestAnnotationSettings implements DefaultNodeSettings {

                @TestId(1)
                @TestId2(1)
                String m_sectionSetting;
            }

            final var traverser = getTraverser(TestAnnotationSettings.class);
            final List<Optional<TestId>> ids = new ArrayList<>(0);
            final List<Optional<TestId2>> ids_2 = new ArrayList<>(0);
            traverser.traverse(field -> {
                ids.add(field.trackedAnnotations().getInstance(TestId.class));
                ids_2.add(field.trackedAnnotations().getInstance(TestId2.class));
            }, List.of(TestId.class));
            assertThat(ids).hasSize(1);
            assertThat(ids.get(0).get().value()).isEqualTo(1);
            assertThat(ids_2).hasSize(1);
            assertThat(ids_2.get(0)).isEmpty();
        }

        @Test
        void testSetsParentAnnotationAsDefault() {

            class ClusterOfSettings implements LayoutGroup {

                @TestId(3)
                String m_sub1;

                String m_sub2;
            }

            @TestId(1)
            class TestDefaultParentSettings implements DefaultNodeSettings {

                String m_defaultParentSetting;

                @TestId(2)
                String m_simpleSetting;

                ClusterOfSettings m_clusterOfSettings;

                @TestId(4)
                ClusterOfSettings m_clusterOfSettingsWithDefault;
            }
            final var traverser = getTraverser(TestDefaultParentSettings.class);
            final List<Optional<TestId>> ids = new ArrayList<>(0);
            traverser.traverse(field -> {
                ids.add(field.trackedAnnotations().getInstance(TestId.class));
            }, List.of(TestId.class));
            assertThat(ids).hasSize(6);
            assertThat(ids.get(0).get().value()).isEqualTo(1);
            assertThat(ids.get(1).get().value()).isEqualTo(2);
            assertThat(ids.get(2).get().value()).isEqualTo(3);
            assertThat(ids.get(3).get().value()).isEqualTo(1);
            assertThat(ids.get(4).get().value()).isEqualTo(3);
            assertThat(ids.get(5).get().value()).isEqualTo(4);
        }

        @Test
        void testNoAnnotation() throws JsonProcessingException {

            class TestNoAnnotationSettings implements DefaultNodeSettings {

                String m_setting;

                @TestId(1)
                String m_foo;

            }
            final var traverser = getTraverser(TestNoAnnotationSettings.class);
            final List<Optional<TestId>> ids = new ArrayList<>(0);
            traverser.traverse(field -> {
                ids.add(field.trackedAnnotations().getInstance(TestId.class));
            }, List.of(TestId.class));
            assertThat(ids.get(0)).isEmpty();
            assertThat(ids.get(1).get().value()).isEqualTo(1);
        }

        @Test
        void testThrowsIfAnnotationBothForClassAndEnclosingField() throws JsonProcessingException {

            @TestId
            class ClusterOfSettings implements LayoutGroup {

                String m_sub1;

                String m_sub2;
            }

            class TestConflictingAnnotationsSettings implements DefaultNodeSettings {

                @TestId
                ClusterOfSettings m_setting;

            }
            final var traverser = getTraverser(TestConflictingAnnotationsSettings.class);
            final List<Optional<TestId>> ids = new ArrayList<>(0);
            assertThrows(FieldAnnotationsHolder.FieldAnnotationException.class, () -> traverser.traverse(field -> {
            }, List.of(TestId.class)));
        }
    }
}
