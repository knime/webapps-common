export const fetchSpace = (spaceId: string) => {
  return Promise.resolve({
    id: "*zEVrsi41yHS7HpaX",
    type: "Space",
    path: "/Users/ps-demo-test-lala/Agentic workflows",
    canonicalPath:
      "/Users/account:team:59348c2e-bc49-48dc-af1b-13032d005211/Agentic workflows",
    _class: "com.knime.enterprise.server.rest.api.v4.repository.ent.Space",
    lastEditedOn: "2025-10-21T07:57:08+00:00",
    private: true,
    tags: [],
    contributors: [],
    accesses: [
      {
        identity: "<unknown>",
        role: "admin",
        accountId:
          "account:team:59348c2e-bc49-48dc-af1b-13032d005211:group:accountAdmin",
      },
      {
        identity: "<unknown>",
        role: "viewer",
        accountId:
          "account:team:59348c2e-bc49-48dc-af1b-13032d005211:group:accountMember",
      },
    ],
    kudos: [],
    stats: {
      workflows: 2,
      components: 0,
      dataFiles: 0,
    },
    ownerAccountId: "account:team:59348c2e-bc49-48dc-af1b-13032d005211",
    owner: "ps-demo-test-lala",
    author: "schramm",
    createdOn: "2025-10-21T07:57:08+00:00",
    itemVersionId: "e4389037-121c-4d0a-b11f-391cfa6b4211",
    description:
      "A new generation of agentic workflows that use AI agents to automate complex, multi-step tasks across data preparation, analysis, and orchestration. Instead of single-purpose prompts, these agents reason, plan, and take actions inside KNIME — making workflows smarter, more adaptive, and more autonomous.\n",
    richDescription:
      "<p>A new generation of <strong>agentic workflows</strong> that use AI agents to automate complex, multi-step tasks across data preparation, analysis, and orchestration. Instead of single-purpose prompts, these agents reason, plan, and take actions inside KNIME — making workflows smarter, more adaptive, and more autonomous.</p>",
    downloadCount: 0,
    kudosCount: 0,
    "@controls": {
      self: {
        href: "https://api.hubdev.knime.com/repository/Users/ps-demo-test-lala/Agentic%20workflows",
        method: "GET",
      },
      "knime:download": {
        href: "https://api.hubdev.knime.com/repository/Users/ps-demo-test-lala/Agentic%20workflows:data",
        method: "GET",
      },
      "knime:delete": {
        href: "https://api.hubdev.knime.com/repository/Users/ps-demo-test-lala/Agentic%20workflows",
        method: "DELETE",
      },
      edit: {
        href: "https://api.hubdev.knime.com/repository/Users/ps-demo-test-lala/Agentic%20workflows:data",
        method: "PUT",
        accept: ["*/*"],
        encoding: "Raw",
        title: "Upload new version",
      },
      "knime:upload": {
        href: "https://api.hubdev.knime.com/repository/Users/ps-demo-test-lala/Agentic%20workflows/{name}:data",
        isHrefTemplate: true,
        method: "PUT",
        accept: ["*/*"],
        encoding: "Raw",
        title: "Upload a new item",
      },
      "knime:create": {
        href: "https://api.hubdev.knime.com/repository/Users/ps-demo-test-lala/Agentic%20workflows/{name}",
        isHrefTemplate: true,
        method: "PUT",
        accept: ["*/*"],
        encoding: "Raw",
        title: "Create a new item",
      },
      "knime:initiate-upload": {
        href: "https://api.hubdev.knime.com/repository/*zEVrsi41yHS7HpaX/manifest",
        method: "POST",
        title: "Upload child to item",
      },
      "knime:download-artifact": {
        href: "https://api.hubdev.knime.com/repository/*zEVrsi41yHS7HpaX/artifact",
        method: "GET",
        title: "Download the item",
      },
      "knime:rename": {
        href: "https://api.hubdev.knime.com/spaces/*zEVrsi41yHS7HpaX/name",
        method: "PUT",
        title: "Rename this space",
      },
      "knime:copy": {
        href: "https://api.hubdev.knime.com/repository/*zEVrsi41yHS7HpaX/copies",
        method: "POST",
        title: "Copy this item",
      },
    },
    "@namespaces": {
      knime: {
        name: "http://www.knime.com/server/rels#",
      },
    },
  });
};

export const fetchItems = () => {
  return Promise.resolve();
};
