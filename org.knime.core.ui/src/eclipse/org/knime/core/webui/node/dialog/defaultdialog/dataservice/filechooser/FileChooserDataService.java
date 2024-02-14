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
import java.nio.file.AccessDeniedException;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.NotDirectoryException;
import java.nio.file.Path;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Deque;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
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

    record Folder(List<Object> items, String path) {

        static FolderAndError asRootFolder(final List<Object> items, final String errorMessage,
            final String inputPath) {
            return new FolderAndError(new Folder(items, null), Optional.ofNullable(errorMessage), inputPath);
        }

        static FolderAndError asNonRootFolder(final Path path, final List<Object> items, final String errorMessage,
            final Path inputPath) {
            final var folder = new Folder(items, path.toString());
            return new FolderAndError(folder, Optional.ofNullable(errorMessage), path.relativize(inputPath).toString());
        }
    }

    /**
     * Input parameter for {@link #listItems}
     */
    record ListItemsConfig(
        /**
         * Setting this will impact whether non-readable or non-writable files are not displayed
         */
        Boolean isWriter,
        /**
         * the extensions with respect to which the files are filtered. If empty or null, no filters will be applied.
         */
        List<String> extensions) {
    }

    /**
     * @param folder a representation of the path and the to be displayed items
     * @param errorMessage which if present explains why the folder is not the requested one (e.g. when the requested
     *            one does not exist)
     * @param filePathRelativeToFolder this is the rest of path given by the input of {@link #listItems}. It might be an
     *            empty string if this input consisted only of the returned folder.
     */
    record FolderAndError(Folder folder, Optional<String> errorMessage, String filePathRelativeToFolder) {
    }

    /**
     * Get the items of the specified file system at the specified pair of path and folder name. If the requested path
     * is not accessible or does not exist, the next valid parent folder up to the root directory is used instead
     * together and returned with an appropriate error message.
     *
     * @param fileSystemId specifying the file system.
     * @param path the current path or null to reference the root level.
     * @param nextFolder - the name of the to be accessed folder relative to the path or ".." if the parent folder
     *            should be accessed. Set to null in order to access the path directly.
     * @param listItemConfig additional configuration for the filters applied to the listed files
     * @return A list of items in the next folder possibly together with an error message explaining why the returned
     *         folder is not the requested one.
     *
     *
     * @throws IOException
     */
    public FolderAndError listItems(final String fileSystemId, final String path, final String nextFolder,
        final ListItemsConfig listItemConfig) throws IOException {
        final var fileChooserBackend = m_fsConnector.getFileChooserBackend(fileSystemId);
        final Path nextPath = getNextPath(path, nextFolder, fileChooserBackend.getFileSystem());
        if (nextPath == null && fileChooserBackend.isAbsoluteFileSystem()) {
            return Folder.asRootFolder(getRootItems(fileChooserBackend), null, "");
        }
        final Deque<Path> pathStack = toFragments(fileChooserBackend, nextPath);
        return getItemsInFolder(fileChooserBackend, pathStack, listItemConfig);
    }

    private static Deque<Path> toFragments(final FileChooserBackend fileChooserBackend, final Path nextPath) {
        final Deque<Path> subPaths = new ArrayDeque<>();
        final var defaultPath = getDefaultPath(fileChooserBackend, nextPath);
        if (defaultPath != null) {
            subPaths.push(defaultPath);
        }
        if (nextPath != null) {
            final var pathFragments = StreamSupport.stream(nextPath.spliterator(), false).collect(Collectors.toList());
            for (Path pathFragent : pathFragments) {
                var lastPath = subPaths.peek();
                subPaths.push(lastPath == null ? pathFragent : lastPath.resolve(pathFragent));
            }
        }
        return subPaths;
    }

    private static Path getDefaultPath(final FileChooserBackend fileChooserBackend, final Path nextPath) {
        if (fileChooserBackend.isAbsoluteFileSystem()) {
            final var rootPath = nextPath.getRoot();
            if (rootPath != null) {
                return rootPath;
            }
        }
        return getEmptyPathFolder(fileChooserBackend);
    }

    /**
     * Get the path of the file at the specified path
     *
     * @param fileSystemId specifying the file system.
     * @param path of the folder containing the file
     * @param fileName the name of the to be accessed file relative to the path.
     * @param appendedExtension a file extension that is added to the filename whenever it does not already exist or end
     *            with the extension.
     * @return the full path of the file
     */
    public String getFilePath(final String fileSystemId, final String path, final String fileName,
        final String appendedExtension) {
        final var fileChooserBackend = m_fsConnector.getFileChooserBackend(fileSystemId);
        final var fileSystem = fileChooserBackend.getFileSystem();
        Path nextPath = path == null ? fileSystem.getPath(fileName) : fileSystem.getPath(path, fileName);
        if (appendedExtension != null) {
            nextPath = appendExtensionIfNotPresent(nextPath, appendedExtension);
        }
        return nextPath.toString();
    }

    /**
     * @param appendedExtension is non null here
     */
    private static Path appendExtensionIfNotPresent(final Path nextPath, final String appendedExtension) {
        final var isExistingWritableFile = Files.isWritable(nextPath) && !Files.isDirectory(nextPath);
        if (isExistingWritableFile) {
            return nextPath;
        }
        return nextPath.resolveSibling(String.format("%s.%s", nextPath.getFileName(), appendedExtension));

    }

    private static Path getNextPath(final String path, final String nextFolder, final FileSystem fileSystem) {
        if (path == null) {
            return nextFolder == null ? null : fileSystem.getPath(nextFolder);
        }
        if (nextFolder.equals("..")) {
            return fileSystem.getPath(path).getParent();
        }
        return fileSystem.getPath(path, nextFolder);
    }

    private static List<Object> getRootItems(final FileChooserBackend fileChooserBackend) {
        final List<Object> out = new ArrayList<>();
        fileChooserBackend.getFileSystem().getRootDirectories()
            .forEach(p -> out.add(fileChooserBackend.pathToObject(p)));
        return out;
    }

    private static FolderAndError getItemsInFolder(final FileChooserBackend fileChooserBackend,
        final Deque<Path> pathStack, final ListItemsConfig listItemConfig) throws IOException {
        String errorMessage = null;
        Path inputPath = pathStack.peek();
        while (!pathStack.isEmpty()) {
            final var path = pathStack.pop();
            try {
                final var folderContent =
                    listFilteredAndSortedItems(path, fileChooserBackend.getFileSystem(), listItemConfig) //
                        .stream().map(fileChooserBackend::pathToObject).toList();
                return createFolder(path, folderContent, errorMessage, fileChooserBackend, inputPath);
            } catch (NotDirectoryException ex) { //NOSONAR
                /**
                 * Do not set an error message in this case, since we intentionally get here when opening the file
                 * chooser with a preselected file path which we pass as folder path to get to the containing folder
                 * instead
                 */
            } catch (NoSuchFileException ex) { //NOSONAR
                if (errorMessage == null && !listItemConfig.isWriter()) {
                    errorMessage = String.format("The selected path %s does not exist", path);
                }
            } catch (AccessDeniedException ex) { //NOSONAR
                if (errorMessage == null) {
                    errorMessage = String.format("Access to the selected path %s is denied", path);
                }
            }
        }
        throw new IllegalStateException(
            "Something went wrong. There should be at least one valid path in the given stack.");
    }

    private static FolderAndError createFolder(final Path path, final List<Object> folderContent,
        final String errorMessage, final FileChooserBackend fileChooserBackend, final Path inputPath) {
        if (fileChooserBackend.isAbsoluteFileSystem()) {
            return Folder.asNonRootFolder(path.toAbsolutePath(), folderContent, errorMessage, inputPath);
        } else {
            return getEmptyPathFolder(fileChooserBackend).equals(path)
                ? Folder.asRootFolder(folderContent, errorMessage, path.relativize(inputPath).toString())
                : Folder.asNonRootFolder(path, folderContent, errorMessage, inputPath);
        }
    }

    private static Path getEmptyPathFolder(final FileChooserBackend fileChooserBackend) {
        return fileChooserBackend.getFileSystem().getPath("");
    }

    private static List<Path> listFilteredAndSortedItems(final Path folder, final FileSystem fileSystem,
        final ListItemsConfig listItemConfig) throws IOException {

        final Predicate<Path> filterPredicate = getFilterPredicate(fileSystem, listItemConfig);

        return Files.list(folder) //
            .filter(t -> {
                try {
                    return !Files.isHidden(t);
                } catch (IOException ex) { // NOSONAR
                    return true;
                }
            }) //
            .filter(item -> Files.isDirectory(item) || filterPredicate.test(item))
            .sorted(
                Comparator.comparingInt(FileChooserDataService::getFileTypeOrdinal).thenComparing(Path::getFileName))
            .toList();
    }

    private static Predicate<Path> getFilterPredicate(final FileSystem fileSystem,
        final ListItemsConfig listItemConfig) {
        final var extensionsPredicate = getExtensionPredicate(fileSystem, listItemConfig.extensions());
        final var readerOrWriterPredicate = getReaderOrWriterPredicate(listItemConfig.isWriter());
        return extensionsPredicate.and(readerOrWriterPredicate);
    }

    private static Predicate<Path> getReaderOrWriterPredicate(final Boolean isWriter) {
        return isWriter ? Files::isWritable : Files::isReadable;
    }

    private static Predicate<Path> getExtensionPredicate(final FileSystem fileSystem, final List<String> extensions) {
        if (extensions != null && !extensions.isEmpty()) {
            final var endingsMatcher =
                fileSystem.getPathMatcher(String.format("glob:**.{%s}", String.join(",", extensions)));
            return endingsMatcher::matches;
        }
        return path -> true;
    }

    private static int getFileTypeOrdinal(final Path file) {
        return Files.isDirectory(file) ? 0 : 1;
    }

}
