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
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
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

    /**
     * Simulating the root folder of this test file system
     */
    @TempDir
    private Path m_tempRootFolder;

    /**
     * A folder within the root folder
     */
    private Path m_subFolder;

    private MockedConstruction<LocalFileChooserBackend> fileChooserBackendMock;

    private FileSystem m_fileSystem;

    @BeforeEach
    void mockFileChooserBackend() throws IOException {
        m_subFolder = Files.createTempDirectory(m_tempRootFolder, "directoryPath");
        m_fileSystem = mock(FileSystem.class);
        when(m_fileSystem.getRootDirectories()).thenReturn(List.of(m_tempRootFolder));
        fileChooserBackendMock = Mockito.mockConstruction(LocalFileChooserBackend.class, (mock, context) -> {
            when(mock.getFileSystem()).thenReturn(m_fileSystem);
            when(mock.pathToObject(ArgumentMatchers.any())).thenCallRealMethod();
        });
    }

    @AfterEach
    void endMockingFileChooserBackend() {
        fileChooserBackendMock.close();
    }

    @Test
    void testGetLocalRootItems() throws IOException {
        final var dataService = new FileChooserDataService();
        final var rootItems = dataService.listItems("local", null, null);
        verify(fileChooserBackendMock.constructed().get(0)).pathToObject(eq(m_tempRootFolder));
        assertThat(rootItems.folder().items()).hasSize(1);
        assertThat(rootItems.errorMessage()).isEmpty();
        final var rootItem = (Item)rootItems.folder().items().get(0);
        assertThat(rootItem.isDirectory()).isTrue();
    }

    @Test
    void testListLocalItemsRelativeToPath() throws IOException {
        final var directory = Files.createTempDirectory(m_subFolder, "aDirectory");
        final var subDirectory = Files.createTempDirectory(directory, "aSubDirectory");
        final var dataService = new FileChooserDataService();
        final var path = m_subFolder.toString();
        final var folderName = directory.getFileName().toString();
        when(m_fileSystem.getPath(eq(path), eq(folderName))).thenReturn(directory);
        final var rootItems = dataService.listItems("local", path, folderName);
        final var fileChooserBackend = fileChooserBackendMock.constructed().get(0);
        verify(fileChooserBackend).pathToObject(eq(subDirectory));
        assertThat(rootItems.errorMessage()).isEmpty();
        final var items = rootItems.folder().items();
        assertThat(items).hasSize(1);
    }

    @Test
    void testListLocalItemsWithoutPath() throws IOException {
        final var directory = Files.createTempDirectory(m_subFolder, "aDirectory");
        final var file = Files.writeString(m_subFolder.resolve("aFile"), "");
        final var dataService = new FileChooserDataService();
        final var pathToDir = directory.toString();
        when(m_fileSystem.getPath(eq(pathToDir))).thenReturn(m_subFolder);
        final var rootItems = dataService.listItems("local", null, pathToDir);
        final var fileChooserBackend = fileChooserBackendMock.constructed().get(0);
        verify(fileChooserBackend).pathToObject(eq(directory));
        verify(fileChooserBackend).pathToObject(eq(file));
        assertThat(rootItems.errorMessage()).isEmpty();
        final var items = rootItems.folder().items();
        assertThat(items).hasSize(2);
        assertThat(items.stream().map(item -> ((Item)item).isDirectory()).count()).isEqualTo(2);
    }

    @Test
    void testListLocalItemsWithInvalidPath() throws IOException {
        final var deletedFolder = Files.createTempDirectory(m_subFolder, "aDirectory");
        Files.delete(deletedFolder);
        final var dataService = new FileChooserDataService();
        final var correctPath = m_subFolder.toString();
        final var invalidPath = correctPath + "/non-existing folder/file.txt";
        when(m_fileSystem.getPath(eq(invalidPath))).thenReturn(deletedFolder);
        when(m_fileSystem.getPath(eq(correctPath))).thenReturn(m_subFolder);
        final var listedItems = dataService.listItems("local", null, invalidPath);
        assertThat(listedItems.errorMessage().get())
            .isEqualTo(String.format("The selected path %s does not exist", deletedFolder.toAbsolutePath()));
        assertThat(listedItems.folder().path()).isEqualTo(correctPath);
    }

    @Test
    void testListLocalItemsParentPath() throws IOException {
        final var directory = Files.createTempDirectory(m_subFolder, "aDirectory");
        final var file = Files.writeString(m_subFolder.resolve("aFile"), "");
        final var dataService = new FileChooserDataService();
        final var path = directory.toString();
        when(m_fileSystem.getPath(eq(path))).thenReturn(directory);
        final var rootItems = dataService.listItems("local", path, "..");
        final var fileChooserBackend = fileChooserBackendMock.constructed().get(0);
        verify(fileChooserBackend).pathToObject(eq(directory));
        verify(fileChooserBackend).pathToObject(eq(file));
        final var items = rootItems.folder().items();
        assertThat(items).hasSize(2);
        assertThat(items.stream().map(item -> ((Item)item).isDirectory()).count()).isEqualTo(2);
    }

    @Test
    void testThrowsOnWrongFileSystemId() {
        final var dataService = new FileChooserDataService();
        assertThrows(IllegalArgumentException.class, () -> dataService.listItems("notAValidFileSystemId", null, null));
    }

    @Test
    void testReusesFileSystem() throws IOException {
        final var dataService = new FileChooserDataService();
        dataService.listItems("local", null, null);
        dataService.listItems("local", null, null);
        assertThat(fileChooserBackendMock.constructed()).hasSize(1);
    }

    @Test
    void testClosesAndClearsFileSystemOnClear() throws IOException {
        final var dataService = new FileChooserDataService();
        dataService.listItems("local", null, null);
        dataService.clear();
        verify(fileChooserBackendMock.constructed().get(0)).close();
        dataService.listItems("local", null, null);
        assertThat(fileChooserBackendMock.constructed()).hasSize(2);
    }

    @Test
    void testGetFilePath() throws IOException {
        final var file = Files.writeString(m_subFolder.resolve("aFile"), "");
        final var path = m_subFolder.toString();
        final var fileName = file.getFileName().toString();
        when(m_fileSystem.getPath(eq(path), eq(fileName))).thenReturn(file);
        final var dataService = new FileChooserDataService();
        final var filePath = dataService.getFilePath("local", path, fileName);
        assertThat(filePath).isEqualTo(file.toString());
    }
}
