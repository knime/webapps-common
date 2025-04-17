import { FetchError, type FetchOptions } from "ofetch";

import { type HubAvatarData, rfcErrors } from "@knime/hub-features";
import { VERSION_DEFAULT_LIMIT } from "@knime/hub-features/versions";
import type {
  AssignedLabel,
  ItemPermission,
  ItemSavepoint,
  NamedItemVersion,
  RepositoryItem,
  WithAvatar,
  WithLabels,
} from "@knime/hub-features/versions";

import { DEFAULT_API_BASE_URL } from "../../common/constants";
import { getFetchClient } from "../../common/ofetchClient";

type UseVersionsApiOptions = {
  baseUrl?: string;
  customFetchClientOptions?: FetchOptions;
};

export const useVersionsApi = ({
  baseUrl,
  customFetchClientOptions,
}: UseVersionsApiOptions) => {
  const $ofetch = getFetchClient(customFetchClientOptions);

  const doHubRequest = (path: string, fetchOptions?: FetchOptions) => {
    const res = `${baseUrl ?? DEFAULT_API_BASE_URL}${path}`;
    const defaults: FetchOptions = {
      method: "GET",
    };

    try {
      consola.trace("useVersionsApi::calling", {
        path: res,
        options: fetchOptions,
      });

      return $ofetch(res, {
        ...defaults,
        ...fetchOptions,
      });
    } catch (error) {
      if (error instanceof FetchError) {
        throw rfcErrors.tryParse(error);
      }

      throw error;
    }
  };

  const fetchRepositoryItem = ({ itemId }: { itemId: string }) => {
    return doHubRequest(`/repository/${itemId}`) as Promise<RepositoryItem>;
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

  const fetchResourceLabels = ({
    resourceType,
    resourceId,
  }: {
    resourceType: "savepoint";
    resourceId: string;
  }) => {
    return doHubRequest(
      `/validation/validation/resources/${resourceType}/${resourceId}/labels`,
    ).catch(() => ({ assignedLabels: [] })) as Promise<{
      assignedLabels: Array<AssignedLabel>;
    }>;
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
  };

  const loadSavepointMetadata = async (
    savepoint: ItemSavepoint,
  ): Promise<WithAvatar & WithLabels> => {
    return {
      avatar: await getAvatar({
        accountName: savepoint.version?.author ?? savepoint.author,
      }),
      labels: savepoint.itemVersionId
        ? await fetchResourceLabels({
            resourceType: "savepoint",
            resourceId: savepoint.itemVersionId,
          }).then((response) => response.assignedLabels)
        : [],
    };
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
    fetchResourceLabels,
    fetchItemSavepoints,
    fetchPermissions,
    loadSavepointMetadata,
    deleteVersion,
    restoreVersion,
    createVersion,
    getAvatar,
  };
};

export type VersionsAPI = ReturnType<typeof useVersionsApi>;
