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
 *   Oct 30, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.dataservice.filechooser;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.PathMatcher;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.knime.core.webui.node.dialog.defaultdialog.dataservice.filechooser.FileChooserDataService.FolderAndError;
import org.knime.core.webui.node.dialog.defaultdialog.dataservice.filechooser.FileChooserDataService.ListItemsConfig;
import org.knime.core.webui.node.dialog.defaultdialog.dataservice.filechooser.SimpleFileChooserBackend.Item;
import org.mockito.ArgumentMatchers;
import org.mockito.MockedConstruction;
import org.mockito.Mockito;

/**
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class FileChooserDataServiceTest {

    @Nested
    class AbsoluteFileSystemTest extends NestedFileChooserDataServiceTest {

        /**
         * Simulating the root folder of this test file system
         */
        @TempDir
        private Path m_tempRootFolder;

        @Override
        Path getDefaultDirectory() {
            return m_tempRootFolder;
        }

        @Override
        FileSystem getFileSystem() {
            final var fileSystem = mock(FileSystem.class);
            when(fileSystem.getRootDirectories()).thenReturn(List.of(m_tempRootFolder));
            return fileSystem;
        }

        @Override
        boolean useAbsoluteFileSystem() {
            return true;
        }

        @Override
        List<Path> getItemsInInitialFolder() {
            return List.of(getDefaultDirectory());
        }

        @Test
        void testThrowsOnWrongFileSystemId() {
            final var dataService = new FileChooserDataService();
            assertThrows(IllegalArgumentException.class,
                () -> dataService.listItems("notAValidFileSystemId", null, null, new ListItemsConfig(false, null)));
        }

        @Test
        void testReusesFileSystem() throws IOException {
            final var dataService = new FileChooserDataService();
            dataService.listItems("local", null, null, new ListItemsConfig(false, null));
            dataService.listItems("local", null, null, new ListItemsConfig(false, null));
            assertThat(fileChooserBackendMock.constructed()).hasSize(1);
        }

        @Test
        void testClosesAndClearsFileSystemOnClear() throws IOException {
            final var dataService = new FileChooserDataService();
            dataService.listItems("local", null, null, new ListItemsConfig(false, null));
            dataService.clear();
            verify(fileChooserBackendMock.constructed().get(0)).close();
            dataService.listItems("local", null, null, new ListItemsConfig(false, null));
            assertThat(fileChooserBackendMock.constructed()).hasSize(2);
        }

    }

    @Nested
    class RelativeFileSystemTest extends NestedFileChooserDataServiceTest {

        @TempDir
        private Path m_emptyPathDirectory;

        @Override
        Path getDefaultDirectory() {
            return m_emptyPathDirectory;
        }

        @Override
        FileSystem getFileSystem() {
            final var fileSystem = mock(FileSystem.class);
            when(fileSystem.getPath(eq(""))).thenReturn(getDefaultDirectory());
            return fileSystem;
        }

        @Override
        boolean useAbsoluteFileSystem() {
            return false;
        }

        @Override
        List<Path> getItemsInInitialFolder() throws IOException {
            return Files.list(getDefaultDirectory()).toList();
        }

    }

    abstract class NestedFileChooserDataServiceTest {

        /**
         * A folder within the default folder
         */
        protected Path m_subFolder;

        protected MockedConstruction<LocalFileChooserBackend> fileChooserBackendMock;

        protected FileSystem m_fileSystem;

        abstract Path getDefaultDirectory();

        abstract FileSystem getFileSystem();

        abstract boolean useAbsoluteFileSystem();

        abstract List<Path> getItemsInInitialFolder() throws IOException;

        @BeforeEach
        void mockFileChooserBackend() throws IOException {
            m_subFolder = Files.createTempDirectory(getDefaultDirectory(), "directoryPath");
            m_fileSystem = getFileSystem();
            fileChooserBackendMock = Mockito.mockConstruction(LocalFileChooserBackend.class, (mock, context) -> {
                when(mock.getFileSystem()).thenReturn(m_fileSystem);
                when(mock.pathToObject(ArgumentMatchers.any())).thenCallRealMethod();
                when(mock.isAbsoluteFileSystem()).thenReturn(useAbsoluteFileSystem());
            });
        }

        @AfterEach
        void endMockingFileChooserBackend() {
            if (fileChooserBackendMock != null) {
                fileChooserBackendMock.close();
            }
        }

        @Test
        void testGetItemsWithoutParameters() throws IOException {
            final var result = new PerformListItemsBuilder().build().performListItems();

            getItemsInInitialFolder()
                .forEach(item -> verify(fileChooserBackendMock.constructed().get(0)).pathToObject(eq(item)));
            assertThat(result.folder().items()).hasSize(1);
            assertThat(result.folder().path()).isNull();
            assertThat(result.errorMessage()).isEmpty();
            final var rootItem = (Item)result.folder().items().get(0);
            assertThat(rootItem.isDirectory()).isTrue();
        }

        @Test
        void testListItemsRelativeToPath() throws IOException {
            final var directory = Files.createTempDirectory(m_subFolder, "aDirectory");
            final var subDirectory = Files.createTempDirectory(directory, "aSubDirectory");
            final var path = relativizeIfNecessary(m_subFolder).toString();
            final var folderName = directory.getFileName().toString();
            when(m_fileSystem.getPath(eq(path), eq(folderName))).thenReturn(relativizeIfNecessary(directory));

            final var result =
                new PerformListItemsBuilder().withPath(path).withFolder(folderName).build().performListItems();

            final var fileChooserBackend = fileChooserBackendMock.constructed().get(0);
            verify(fileChooserBackend).pathToObject(eq(subDirectory));
            assertThat(result.errorMessage()).isEmpty();
            assertThat(result.folder().items()).hasSize(1);
        }

        @Test
        void testListItemsWithFilteredFileExtensions() throws IOException {

            final var fileExtensions = List.of("pdf", "png");

            when(m_fileSystem.getPathMatcher(ArgumentMatchers.any())).thenReturn(new PathMatcher() {

                @Override
                public boolean matches(final Path path) {
                    return fileExtensions.stream().anyMatch(ext -> path.toString().endsWith(ext));
                }
            });
            final var directory = Files.createTempDirectory(m_subFolder, "aDirectory");
            Files.createTempDirectory(directory, "aSubDirectory");
            Files.createTempFile(directory, "aFile", ".pdf");
            Files.createTempFile(directory, "aFile", ".txt");
            final var path = relativizeIfNecessary(m_subFolder).toString();
            final var folderName = directory.getFileName().toString();
            when(m_fileSystem.getPath(eq(path), eq(folderName))).thenReturn(relativizeIfNecessary(directory));

            final var result = new PerformListItemsBuilder().withPath(path).withFolder(folderName)
                .withExtensions(fileExtensions).build().performListItems();
            // One folder (which is not checked against file extensions) and the pdf file but not the txt file
            verify(m_fileSystem).getPathMatcher(eq("glob:**.{pdf,png}"));
            assertThat(result.folder().items()).hasSize(2);
        }

        @Test
        void testListItemsWithoutPath() throws IOException {
            final var directory = Files.createTempDirectory(m_subFolder, "aDirectory");
            final var file = Files.writeString(m_subFolder.resolve("aFile"), "");
            final var pathToDir = pathToString(relativizeIfNecessary(m_subFolder));

            final var result = new PerformListItemsBuilder().withFolder(pathToDir).build().performListItems();

            final var fileChooserBackend = fileChooserBackendMock.constructed().get(0);
            verify(fileChooserBackend).pathToObject(eq(directory));
            verify(fileChooserBackend).pathToObject(eq(file));
            assertThat(result.errorMessage()).isEmpty();
            final var items = result.folder().items();
            assertThat(items).hasSize(2);
            assertThat(items.stream().map(item -> ((Item)item).isDirectory()).count()).isEqualTo(2);
        }

        @Test
        void testListItemsWithInvalidPath() throws IOException {
            final var deletedFolder = Files.createTempDirectory(m_subFolder, "aDirectory");
            Files.delete(deletedFolder);
            final var invalidPath = pathToString(relativizeIfNecessary(deletedFolder));

            final var result = new PerformListItemsBuilder().withFolder(invalidPath).build().performListItems();

            assertThat(result.errorMessage().get())
                .isEqualTo(String.format("The selected path %s does not exist", deletedFolder));
            assertThat(result.folder().path()).isEqualTo(m_subFolder.toString());
        }

        @Test
        void testListItemsWithInvalidPathWriter() throws IOException {
            final var deletedFolder = Files.createTempDirectory(m_subFolder, "aDirectory");
            Files.delete(deletedFolder);
            final var invalidPath = pathToString(relativizeIfNecessary(deletedFolder));

            final var result =
                new PerformListItemsBuilder().asWriter().withFolder(invalidPath).build().performListItems();

            assertThat(result.errorMessage()).isEmpty();
            assertThat(result.folder().path()).isEqualTo(m_subFolder.toString());
            assertThat(result.filePathRelativeToFolder()).isEqualTo(deletedFolder.getFileName().toString());
        }

        @Test
        void testListItemsParentPath() throws IOException {
            final var directory = Files.createTempDirectory(m_subFolder, "aDirectory");
            final var file = Files.writeString(m_subFolder.resolve("aFile"), "");
            final var path = pathToString(relativizeIfNecessary(directory));

            final var rootItems =
                new PerformListItemsBuilder().withFolder("..").withPath(path).build().performListItems();

            final var fileChooserBackend = fileChooserBackendMock.constructed().get(0);
            verify(fileChooserBackend).pathToObject(eq(directory));
            verify(fileChooserBackend).pathToObject(eq(file));
            final var items = rootItems.folder().items();
            assertThat(items).hasSize(2);
            assertThat(items.stream().map(item -> ((Item)item).isDirectory()).count()).isEqualTo(2);
        }

        @Test
        void testGetFilePath() throws IOException {
            final var file = Files.writeString(m_subFolder.resolve("aFile"), "");
            final var path = relativizeIfNecessary(m_subFolder).toString();
            final var fileName = file.getFileName().toString();
            when(m_fileSystem.getPath(eq(path), eq(fileName))).thenReturn(file);
            final var filePath = new FileChooserDataService().getFilePath("local", path, fileName, null);
            assertThat(filePath).isEqualTo(file.toString());
        }

        @Nested
        class GetFilePathAppendExtensionTest {

            final static String APPENDEN_EXTENSION = "ext";

            @Test
            void testGetFilePathDoesNotAppendExtensionForExistingFile() throws IOException {
                final var file = Files.writeString(m_subFolder.resolve("aFile"), "");
                final var path = relativizeIfNecessary(m_subFolder).toString();
                final var fileName = file.getFileName().toString();
                when(m_fileSystem.getPath(eq(path), eq(fileName))).thenReturn(file);
                final var filePath =
                    new FileChooserDataService().getFilePath("local", path, fileName, APPENDEN_EXTENSION);
                assertThat(filePath).doesNotEndWith("." + APPENDEN_EXTENSION);
            }

            @Test
            void testGetFilePathDoesAppendExtensionIfADirectoryOfThatNameExists() throws IOException {
                final var directory = Files.createTempDirectory(m_subFolder, "aDirectory");
                final var path = relativizeIfNecessary(m_subFolder).toString();
                final var fileName = directory.getFileName().toString();
                when(m_fileSystem.getPath(eq(path), eq(fileName))).thenReturn(directory);
                final var filePath =
                    new FileChooserDataService().getFilePath("local", path, fileName, APPENDEN_EXTENSION);
                assertThat(filePath).endsWith("." + APPENDEN_EXTENSION);
            }

            @Test
            void testGetFilePathDoesAppendExtensionTheFileDoesNotYetExists() throws IOException {
                final var file = m_subFolder.resolve("aFile");
                final var path = relativizeIfNecessary(m_subFolder).toString();
                final var fileName = file.getFileName().toString();
                when(m_fileSystem.getPath(eq(path), eq(fileName))).thenReturn(file);
                final var filePath =
                    new FileChooserDataService().getFilePath("local", path, fileName, APPENDEN_EXTENSION);
                assertThat(filePath).endsWith("." + APPENDEN_EXTENSION);
            }

            @Test
            void testGetFilePathDoesNotAppendExtensionIfExtensionAlreadyPresent() throws IOException {
                final var file = Files.writeString(m_subFolder.resolve("aFile." + APPENDEN_EXTENSION), "");
                final var path = relativizeIfNecessary(m_subFolder).toString();
                final var fileName = file.getFileName().toString();
                when(m_fileSystem.getPath(eq(path), eq(fileName))).thenReturn(file);
                final var filePath =
                    new FileChooserDataService().getFilePath("local", path, fileName, APPENDEN_EXTENSION);
                assertThat(filePath).doesNotEndWith(APPENDEN_EXTENSION + "." + APPENDEN_EXTENSION);
            }
        }

        private Path relativizeIfNecessary(final Path absolutePath) {
            if (useAbsoluteFileSystem()) {
                return absolutePath;
            }
            return getDefaultDirectory().relativize(absolutePath);
        }

        private String pathToString(final Path path) {
            final var pathString = path.toString();
            when(m_fileSystem.getPath(eq(pathString))).thenReturn(path);
            return pathString;
        }

        interface PerformListItems {
            FolderAndError performListItems() throws IOException;
        }

        static final class PerformListItemsBuilder {

            private String m_folder;

            private String m_path;

            private boolean m_isWriter;

            private List<String> m_extensions;

            private FileChooserDataService m_dataService;

            private String m_fileSystemId;

            PerformListItems build() {
                if (m_dataService == null) {
                    m_dataService = new FileChooserDataService();
                }
                final var config = new ListItemsConfig(m_isWriter, m_extensions);
                return new PerformListItems() {

                    @Override
                    public FolderAndError performListItems() throws IOException {
                        return m_dataService.listItems(m_fileSystemId, m_path, m_folder, config);
                    }

                };

            }

            PerformListItemsBuilder() {
                m_fileSystemId = "local";
            }

            PerformListItemsBuilder withPath(final String path) {
                m_path = path;
                return this;
            }

            PerformListItemsBuilder withFolder(final String folder) {
                m_folder = folder;
                return this;
            }

            PerformListItemsBuilder asWriter() {
                m_isWriter = true;
                return this;
            }

            PerformListItemsBuilder withExtensions(final List<String> extensions) {
                m_extensions = extensions;
                return this;
            }

            PerformListItemsBuilder fromDataService(final FileChooserDataService dataService) {
                m_dataService = dataService;
                return this;
            }

        }
    }

}
