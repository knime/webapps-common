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
 *   Sep 7, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.dataservice.filechooser;

import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.NotDirectoryException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.knime.core.webui.node.dialog.defaultdialog.dataservice.filechooser.FileSystemConnector.FileChooserBackend;

/**
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("resource")
public final class FileChooserDataService {

    private final FileSystemConnector m_fsConnector;

    /**
     * This data service is used in the DefaultNodeDialog and can be accessed by the frontend using the name
     * "fileChooser".
     */
    public FileChooserDataService() {
        m_fsConnector = new FileSystemConnector();
    }

    /**
     * Closes all current file connections. To be called on deactivation of the service.
     */
    public void clear() {
        m_fsConnector.clear();
    }

    /**
     * Get the items of the specified file system at the specified pair of path and folder name
     *
     * @param fileSystemId specifying the file system.
     * @param path the current path or null to reference the root level.
     * @param nextFolder - the name of the to be accessed folder relative to the path or ".." if the parent folder
     *            should be accessed. Set to null in order to access the path directly.
     * @return A list of items in the next folder
     * @throws IOException if the folder is invalid or cannot be accessed
     */
    public Folder listItems(final String fileSystemId, final String path, final String nextFolder) throws IOException {
        final var fileChooserBackend = m_fsConnector.getFileChooserBackend(fileSystemId);
        final Path nextPath = getNextPath(path, nextFolder, fileChooserBackend.getFileSystem());
        if (nextPath == null) {
            return getRootItems(fileChooserBackend);
        }
        final Stack<Path> pathStack = toFragments(fileChooserBackend, nextPath);
        return getItemsInFolder(fileChooserBackend, pathStack);
    }

    private static Stack<Path> toFragments(final FileChooserBackend fileChooserBackend, final Path nextPath) {
        final Stack<Path> pathStack = new Stack<>();
        final var pathFragments = StreamSupport.stream(nextPath.spliterator(), false).collect(Collectors.toList());
        final var rootPath = nextPath.getRoot();
        pathStack.add(fileChooserBackend.getFileSystem().getPath(""));
        if (rootPath != null) {
            pathStack.push(rootPath);
        }
        for (Path pathFragent : pathFragments) {
            var lastPath = pathStack.peek();
            pathStack.add(lastPath.resolve(pathFragent));
        }
        return pathStack;
    }

    /**
     * Get the path of the file at the specified path
     *
     * @param fileSystemId specifying the file system.
     * @param path of the folder containing the file
     * @param fileName the name of the to be accessed file relative to the path.
     * @return the full path of the file
     * @throws IOException if the path or file name are invalid or cannot be accessed
     */
    public String getFilePath(final String fileSystemId, final String path, final String fileName) throws IOException {
        final var fileChooserBackend = m_fsConnector.getFileChooserBackend(fileSystemId);
        final Path nextPath = getNextPath(path, fileName, fileChooserBackend.getFileSystem());
        return nextPath.toString();
    }

    private static Path getNextPath(final String path, final String nextFolder, final FileSystem fileSystem) {
        if (path == null) {
            return nextFolder == null ? null : fileSystem.getPath(nextFolder);
        }
        if (nextFolder.equals("..")) {
            return fileSystem.getPath(path).toAbsolutePath().getParent();
        }
        return fileSystem.getPath(path, nextFolder);
    }

    private static Folder getRootItems(final FileChooserBackend fileChooserBackend) {
        final List<Object> out = new ArrayList<>();
        fileChooserBackend.getFileSystem().getRootDirectories()
            .forEach(p -> out.add(fileChooserBackend.pathToObject(p)));
        return Folder.asRootFolder(out);
    }

    private static Folder getItemsInFolder(final FileChooserBackend fileChooserBackend, final Stack<Path> pathStack)
        throws IOException {
        while (!pathStack.isEmpty()) {
            final var folder = pathStack.pop();
            try {
                final var folderContent = Files.list(folder).map(fileChooserBackend::pathToObject).toList();
                return Folder.asNonRootFolder(folder, folderContent);
            } catch (NoSuchFileException | NotDirectoryException ex) { //NOSONAR
            }
        }
        throw new IllegalStateException(
            "Something went wrong. There should be at least one valid path in the given stack.");

    }

    record Folder(List<Object> items, String path) {
        static Folder asRootFolder(final List<Object> items) {
            return new Folder(items, null);
        }

        static Folder asNonRootFolder(final Path path, final List<Object> items) {
            return new Folder(items, path.toAbsolutePath().toString());
        }
    }

}
