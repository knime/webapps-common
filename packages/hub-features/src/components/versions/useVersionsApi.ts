/* global RequestInit */
import { merge } from "lodash-es";

import type { HubAvatarData } from "@knime/hub-features";
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

type UseVersionsApiOptions = {
  baseUrl?: string;
};

export const useVersionsApi = ({ baseUrl }: UseVersionsApiOptions) => {
  const doHubRequest = (path: string, requestOptions: RequestInit = {}) => {
    const res = `${baseUrl}${path}`;
    consola.trace(`useVersionsApi::fetching '${res}'`, requestOptions);

    const defaults = {
      method: "GET",
    };
    return fetch(res, {
      ...defaults,
      ...requestOptions,
    });
  };

  const doHubRequestJson = async (
    path: string,
    requestOptions: RequestInit = {},
  ) => {
    merge(requestOptions, {
      headers: { "Content-Type": "application/json" as const },
    });
    const response = await doHubRequest(path, requestOptions);
    return response.json();
  };

  const fetchRepositoryItem = ({ itemId }: { itemId: string }) => {
    return doHubRequestJson(
      `/repository/${itemId}`,
      {},
    ) as Promise<RepositoryItem>;
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

    return doHubRequestJson(path) as Promise<{
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
    return doHubRequestJson(
      `/validation/validation/resources/${resourceType}/${resourceId}/labels`,
      {},
    ).catch(() => ({ assignedLabels: [] })) as Promise<{
      assignedLabels: Array<AssignedLabel>;
    }>;
  };

  const deleteVersion = ({
    projectItemId,
    version,
  }: {
    projectItemId: string;
    version: NamedItemVersion["version"];
  }) => {
    return doHubRequest(`/repository/${projectItemId}/versions/${version}`, {
      method: "DELETE",
    });
  };

  const createVersion = ({
    projectItemId,
    title,
    description,
  }: {
    projectItemId: string;
    title: string;
    description: string;
  }): Promise<NamedItemVersion> => {
    return doHubRequestJson(`/repository/${projectItemId}/versions`, {
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
    const accountInfo = await doHubRequestJson(
      `/accounts/name/${accountName}`,
      {
        headers: {
          Prefer: "representation=minimal",
        },
      },
    );

    return {
      kind: accountInfo.type === "TEAM" ? "group" : "account",
      name: accountInfo.name,
      image: {
        url: accountInfo.avatarUrl,
        altText: `${accountInfo.realName ?? accountInfo.name} profile image`,
      },
    } satisfies HubAvatarData;
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
    return doHubRequestJson(
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
    createVersion,
    getAvatar,
  };
};

export type VersionsAPI = ReturnType<typeof useVersionsApi>;
