import type { Space, WorkflowGroup } from "../../api/types";

export const SPACE_MOCK_DATA: Space = {
  id: "*zEVrsi41yHS7HpaX",
  type: "Space",
  path: "/Users/ps-demo-test-lala/Agentic workflows",
  canonicalPath:
    "/Users/account:team:59348c2e-bc49-48dc-af1b-13032d005211/Agentic workflows",
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
};

export const WORKFLOW_GROUP_MOCK: WorkflowGroup = {
  id: "*zEVrsi41yHS7HpaX",
  type: "Space",
  path: "/Users/ps-demo-test-lala/Agentic workflows",
  canonicalPath:
    "/Users/account:team:59348c2e-bc49-48dc-af1b-13032d005211/Agentic workflows",
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
  children: [
    {
      id: "*cTTeiG-_m1CfDm-M",
      type: "Workflow",
      path: "/Users/ps-demo-test-lala/Agentic workflows/2.1 - Simple ChatGPT prompt 2.1 - Simple ChatGPT prompt 2.1 - Simple ChatGPT prompt 2.1 - Simple ChatGPT prompt 2.1 - Simple ChatGPT prompt 2.1 - Simple ChatGPT prompt 2.1 - Simple ChatGPT prompt",
      canonicalPath:
        "/Users/account:team:59348c2e-bc49-48dc-af1b-13032d005211/Agentic workflows/2.1 - Simple ChatGPT prompt 2.1 - Simple ChatGPT prompt 2.1 - Simple ChatGPT prompt 2.1 - Simple ChatGPT prompt 2.1 - Simple ChatGPT prompt 2.1 - Simple ChatGPT prompt 2.1 - Simple ChatGPT prompt",
      _class: "com.knime.enterprise.server.rest.api.v4.repository.ent.Workflow",
      ownerAccountId: "account:team:59348c2e-bc49-48dc-af1b-13032d005211",
      owner: "ps-demo-test-lala",
      author: "knime356",
      createdOn: "2023-07-04T15:07:14+00:00",
      itemVersionId: "5ee70a03-f0a8-4acb-a74d-0bc6d74efcde",
      itemVersion: 1,
      itemVersionCreatedOn: "2026-01-29T11:28:36+00:00",
      description:
        "You can easily download and run the workflow directly in your KNIME installation. We recommend that you use the latest version of the KNIME Analytics Platform for optimal performance.\n\nThis workflow shows how to connect to the model behind ChatGPT and send prompts to it.\n\nThe key difference between a LLM and a ChatModel is that a ChatModel can refer to previous messages (conversation)\n\nIn order to run the workflow you need an OpenAI API key. If you don't have one already, register with OpenAI and create a new API key under https://platform.openai.com/account/api-keys",
      richDescription:
        "You can easily download and run the workflow directly in your KNIME installation. We recommend that you use the latest version of the KNIME Analytics Platform for optimal performance.<br><br>This workflow shows how to connect to the model behind ChatGPT and send prompts to it.<br><br>The key difference between a LLM and a ChatModel is that a ChatModel can refer to previous messages (conversation)<br><br>In order to run the workflow you need an OpenAI API key. If you don't have one already, register with OpenAI and create a new API key under https://platform.openai.com/account/api-keys",
      downloadCount: 0,
      lastEditedOn: "2024-02-09T10:34:43+00:00",
      lastUploadedOn: "2025-10-21T08:04:38+00:00",
      size: 88463,
      kudosCount: 0,
      updateCount: 0,
      updateCheckCount: 0,
    },
    {
      id: "*aLbfIP3jxSFztkJu",
      type: "Workflow",
      path: "/Users/ps-demo-test-lala/Agentic workflows/Agent-1",
      canonicalPath:
        "/Users/account:team:59348c2e-bc49-48dc-af1b-13032d005211/Agentic workflows/Agent-1",
      _class: "com.knime.enterprise.server.rest.api.v4.repository.ent.Workflow",
      ownerAccountId: "account:team:59348c2e-bc49-48dc-af1b-13032d005211",
      owner: "ps-demo-test-lala",
      author: "Emilio.Silvestri",
      createdOn: "2023-02-17T15:54:44+00:00",
      itemVersionId: "51490d55-7964-4216-a77e-689921952d8e",
      itemVersion: 1,
      itemVersionCreatedOn: "2026-03-11T07:49:50+00:00",
      description:
        "<p>In this workflow, you'll read, combine, clean, and summarize data from multiple Excel sheets. You'll calculate the total volume of furniture when moving from one apartment to <strong>another</strong>.</p><p></p><p><strong>Bullet list</strong></p><ul><li><p>Bulletpoint</p></li><li><p>Two</p></li></ul><p><strong>Numbered list</strong></p><ol><li><p>This is one thing</p></li><li><p>asdf</p><ol><li><p>asdasd</p></li><li><p>asdf</p></li></ol></li><li><p>asdf sdf asdf</p></li></ol><p><u>UNDERLINE</u></p><p></p><p><em><u>UNDERLINE AND ITALIC</u></em></p><p></p><p><strong><em><u>BOLD UNDERLINE AND ITALIC</u></em></strong><br><br><strong><em>BOLD AND ITALIC</em></strong></p><p></p><p><strong>Numbered list</strong></p>",
      richDescription:
        "&lt;p&gt;In this workflow, you'll read, combine, clean, and summarize data from multiple Excel sheets. You'll calculate the total volume of furniture when moving from one apartment to &lt;strong&gt;another&lt;/strong&gt;.&lt;/p&gt;&lt;p&gt;&lt;/p&gt;&lt;p&gt;&lt;strong&gt;Bullet list&lt;/strong&gt;&lt;/p&gt;&lt;ul&gt;&lt;li&gt;&lt;p&gt;Bulletpoint&lt;/p&gt;&lt;/li&gt;&lt;li&gt;&lt;p&gt;Two&lt;/p&gt;&lt;/li&gt;&lt;/ul&gt;&lt;p&gt;&lt;strong&gt;Numbered list&lt;/strong&gt;&lt;/p&gt;&lt;ol&gt;&lt;li&gt;&lt;p&gt;This is one thing&lt;/p&gt;&lt;/li&gt;&lt;li&gt;&lt;p&gt;asdf&lt;/p&gt;&lt;ol&gt;&lt;li&gt;&lt;p&gt;asdasd&lt;/p&gt;&lt;/li&gt;&lt;li&gt;&lt;p&gt;asdf&lt;/p&gt;&lt;/li&gt;&lt;/ol&gt;&lt;/li&gt;&lt;li&gt;&lt;p&gt;asdf sdf asdf&lt;/p&gt;&lt;/li&gt;&lt;/ol&gt;&lt;p&gt;&lt;u&gt;UNDERLINE&lt;/u&gt;&lt;/p&gt;&lt;p&gt;&lt;/p&gt;&lt;p&gt;&lt;em&gt;&lt;u&gt;UNDERLINE AND ITALIC&lt;/u&gt;&lt;/em&gt;&lt;/p&gt;&lt;p&gt;&lt;/p&gt;&lt;p&gt;&lt;strong&gt;&lt;em&gt;&lt;u&gt;BOLD UNDERLINE AND ITALIC&lt;/u&gt;&lt;/em&gt;&lt;/strong&gt;&lt;br&gt;&lt;br&gt;&lt;strong&gt;&lt;em&gt;BOLD AND ITALIC&lt;/em&gt;&lt;/strong&gt;&lt;/p&gt;&lt;p&gt;&lt;/p&gt;&lt;p&gt;&lt;strong&gt;Numbered list&lt;/strong&gt;&lt;/p&gt;",
      downloadCount: 0,
      lastEditedOn: "2025-09-30T14:44:22+00:00",
      lastUploadedOn: "2025-10-21T08:04:11+00:00",
      size: 336267,
      kudosCount: 0,
      updateCount: 0,
      updateCheckCount: 0,
    },
    {
      id: "*xZd1Llw1ziMGo1bY",
      type: "WorkflowGroup",
      path: "/Users/ps-demo-test-lala/Agentic workflows/Folder",
      canonicalPath:
        "/Users/account:team:59348c2e-bc49-48dc-af1b-13032d005211/Agentic workflows/Folder",
      _class:
        "com.knime.enterprise.server.rest.api.v4.repository.ent.WorkflowGroup",
      ownerAccountId: "account:team:59348c2e-bc49-48dc-af1b-13032d005211",
      owner: "ps-demo-test-lala",
      author: "schramm",
      createdOn: "2025-10-21T08:03:38+00:00",
      itemVersionId: "e2b56e03-3ccc-426b-8e60-3f5858e5e4f2",
      downloadCount: 0,
    },
    {
      id: "*_MgT81QfzOHgQdVn",
      type: "WorkflowGroup",
      path: "/Users/ps-demo-test-lala/Agentic workflows/NIce",
      canonicalPath:
        "/Users/account:team:59348c2e-bc49-48dc-af1b-13032d005211/Agentic workflows/NIce",
      _class:
        "com.knime.enterprise.server.rest.api.v4.repository.ent.WorkflowGroup",
      ownerAccountId: "account:team:59348c2e-bc49-48dc-af1b-13032d005211",
      owner: "ps-demo-test-lala",
      author: "schramm",
      createdOn: "2025-11-19T12:36:20+00:00",
      itemVersionId: "c54109d8-7e84-4f7d-b5b0-c55430a2ffc1",
      downloadCount: 0,
    },
  ],
  actions: [
    "ADD_ANY_USER",
    "ADD_KUDOS",
    "CREATE_WORKFLOW_GROUP",
    "DELETE_ITEM",
    "DELETE_SPACE",
    "DOWNLOAD_LEAF_ITEM",
    "DOWNLOAD_WORKFLOW_GROUP",
    "DOWNLOAD_SPACE",
    "EDIT_SPACE_DESCRIPTION",
    "EDIT_SPACE_VISIBILITY",
    "READ_ITEM",
    "READ_SPACE",
    "REMOVE_ANY_USER",
    "REMOVE_KUDOS",
    "REMOVE_SELF_USER",
    "RENAME_ITEM",
    "RENAME_SPACE",
    "UPLOAD_ITEM",
  ],
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
};
