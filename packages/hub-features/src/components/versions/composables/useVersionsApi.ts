import { type FetchOptions } from "ofetch";

import { type HubAvatarData, rfcErrors } from "@knime/hub-features";
import { VERSION_DEFAULT_LIMIT } from "@knime/hub-features/versions";
import type {
  AssignedLabel,
  ItemPermission,
  ItemSavepoint,
  NamedItemVersion,
  RepositoryItem,
  VersionLimit,
  WithAvatar,
  WithLabels,
} from "@knime/hub-features/versions";

import { getFetchClient } from "../../../common/ofetchClient";

type UseVersionsApiOptions = {
  customFetchClientOptions?: FetchOptions;
};

export const useVersionsApi = ({
  customFetchClientOptions,
}: UseVersionsApiOptions) => {
  const $ofetch = getFetchClient(customFetchClientOptions);

  const doHubRequest = async (path: string, fetchOptions?: FetchOptions) => {
    const defaults: FetchOptions = {
      method: "GET",
    };

    try {
      consola.trace("useVersionsApi::calling", {
        path,
        options: fetchOptions,
      });

      return await $ofetch(path, { ...defaults, ...fetchOptions });
    } catch (error) {
      throw rfcErrors.tryParse(error) ?? error;
    }
  };

  const fetchRepositoryItem = ({ itemId }: { itemId: string }) => {
    return doHubRequest(`/repository/${itemId}`) as Promise<RepositoryItem>;
  };

  const fetchVersionLimit = ({ itemId }: { itemId: string }) => {
    return doHubRequest(
      `/repository/limits/${itemId}/item-versions`,
    ) as Promise<VersionLimit>;
  };

  const fetchVersions = ({
    itemId,
    loadAll,
  }: {
    itemId: string;
    loadAll: boolean;
  }) => {
    let path = `/repository/${itemId}/versions`;

    if (loadAll) {
      path += "?limit=-1";
    }

    return doHubRequest(path) as Promise<{
      totalCount: number;
      versions: Array<NamedItemVersion>;
    }>;
  };

  const fetchResourceLabels = async ({
    resourceType,
    resourceId,
  }: {
    resourceType: "savepoint";
    resourceId: string;
  }): Promise<{
    assignedLabels: Array<AssignedLabel>;
  }> => {
    try {
      return await doHubRequest(
        `/validation/validation/resources/${resourceType}/${resourceId}/labels`,
      );
    } catch (error) {
      consola.error("useVersionsApi::Failed to fetch resource labels", {
        resourceId,
        resourceType,
        error,
      });

      return { assignedLabels: [] };
    }
  };

  const deleteVersion = ({
    itemId,
    version,
  }: {
    itemId: string;
    version: NamedItemVersion["version"];
  }) => {
    return doHubRequest(`/repository/${itemId}/versions/${version}`, {
      method: "DELETE",
    });
  };

  const restoreVersion = ({
    itemId,
    version,
  }: {
    itemId: string;
    version: NamedItemVersion["version"];
  }) => {
    return doHubRequest(
      `/repository/${itemId}/workingArea?fromVersion=${version}`,
      {
        method: "POST",
      },
    );
  };

  const discardUnversionedChanges = ({ itemId }: { itemId: string }) => {
    return doHubRequest(`/repository/${itemId}/workingArea`, {
      method: "DELETE",
    });
  };

  const createVersion = ({
    itemId,
    title,
    description,
  }: {
    itemId: string;
    title: string;
    description: string;
  }): Promise<NamedItemVersion> => {
    return doHubRequest(`/repository/${itemId}/versions`, {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
      }),
    });
  };

  const getAvatar = async ({
    accountName,
  }: {
    accountName: string;
  }): Promise<HubAvatarData> => {
    try {
      const accountInfo = await doHubRequest(`/accounts/name/${accountName}`, {
        headers: {
          Prefer: "representation=minimal",
        },
      });

      return {
        kind: accountInfo.type === "TEAM" ? "group" : "account",
        name: accountInfo.name,
        image: {
          url: accountInfo.avatarUrl,
          altText: `${accountInfo.realName ?? accountInfo.name} profile image`,
        },
      };
    } catch (error) {
      consola.error("useVersionsApi::Failed to fetch user avatar", {
        accountName,
        error,
      });

      return {
        kind: "account",
        name: "?",
        tooltip: "unknown",
      };
    }
  };

  const loadSavepointMetadata = async (
    savepoint: ItemSavepoint,
  ): Promise<WithAvatar & WithLabels> => {
    const avatar = await getAvatar({
      accountName: savepoint.version?.author ?? savepoint.author,
    });

    const labels = savepoint.itemVersionId
      ? await fetchResourceLabels({
          resourceType: "savepoint",
          resourceId: savepoint.itemVersionId,
        }).then((response) => response.assignedLabels)
      : [];

    return { avatar, labels };
  };

  const fetchItemSavepoints = ({
    itemId,
    limit,
  }: {
    itemId: string;
    limit?: number;
  }) => {
    return doHubRequest(
      `/repository/${itemId}/savepoints?limit=${
        limit ?? VERSION_DEFAULT_LIMIT
      }`,
    ) as Promise<{
      totalCount: number;
      savepoints: Array<ItemSavepoint>;
    }>;
  };

  const fetchPermissions = async ({
    itemId,
  }: {
    itemId: string;
  }): Promise<ItemPermission[]> => {
    const masonControlsMap = {
      "knime:delete": "DELETE",
      edit: "EDIT",
      "knime:configuration": "CONFIGURATION",
      "knime:move": "MOVE",
      "knime:copy": "COPY",
    } as const;

    const repositoryItem = await fetchRepositoryItem({
      itemId,
    });
    return Object.keys(repositoryItem["@controls"])
      .filter((control) => control in masonControlsMap)
      .map(
        (control) => masonControlsMap[control as keyof typeof masonControlsMap],
      );
  };

  return {
    fetchVersions,
    fetchVersionLimit,
    fetchResourceLabels,
    fetchItemSavepoints,
    fetchPermissions,
    loadSavepointMetadata,
    deleteVersion,
    restoreVersion,
    discardUnversionedChanges,
    createVersion,
    getAvatar,
  };
};

export type VersionsAPI = ReturnType<typeof useVersionsApi>;
