/**
 * Utility to modify or extract information from repository paths.
 * As returned by the backend, a repository path must start with a
 * leading slash but must not end with a trailing one. User folders
 * are expected to be in the '/Users/user1' folder. Spaces are expected to
 * be in user folders, e.g. '/Users/user1/space1'
 */

const validateRepositoryPath = (repositoryPath: string) => {
  if (!repositoryPath.startsWith("/")) {
    throw new Error(
      `Specified repository path must start with '/' but was: '${repositoryPath}'`,
    );
  }
  if (repositoryPath.endsWith("/")) {
    throw new Error(
      `Specified repository path must not end with '/' but was: '${repositoryPath}'`,
    );
  }
};

/**
 * Determines the parent of the specified repository path if available
 * (the root '/' will lead to an error).
 *
 * @param repositoryPath a valid repository path
 * @returns the parent of the specified repository path
 */
const getParentPath = ({ repositoryPath }: { repositoryPath: string }) => {
  validateRepositoryPath(repositoryPath);

  if (repositoryPath === "/") {
    throw new Error(`Can't get parent of root: ${repositoryPath}`);
  }

  const parts = repositoryPath.split("/");
  const parentPath = parts.slice(0, parts.length - 1).join("/"); // get parent path
  return parentPath;
};

/**
 * Determines the file name (also works for a folder) like unix basename command
 *
 * @param repositoryPath a valid repository path
 * @returns the name of the file/folder
 */
const getBaseName = (repositoryPath: string) => {
  validateRepositoryPath(repositoryPath);

  const parts = repositoryPath.split("/");

  return parts.at(-1);
};

/**
 * Extract user name, space name, and path relative to the space from the specified repository path.
 * If the specified path does not contain one of the mentioned parts, the returned object will contain
 * an empty string.
 *
 * @param repositoryPath a valid repository path
 * @returns an object containing the user name, space name, and relative space path
 */
const getPathParts = ({ repositoryPath }: { repositoryPath: string }) => {
  validateRepositoryPath(repositoryPath);

  const parts = repositoryPath.split("/");
  const [, usersFolder, user, space, ...relativePath] = parts;

  if (usersFolder !== "Users") {
    throw new Error("Repository path must start with '/Users'");
  }

  const relativePathStr = relativePath.join("/");
  return {
    user: user || "",
    space: space || "",
    relativePath: relativePathStr,
  };
};

export { getParentPath, getPathParts, getBaseName };
