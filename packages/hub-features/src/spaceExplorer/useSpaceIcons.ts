import { markRaw } from "vue";

import CubeIcon from "@knime/styles/img/icons/cube.svg";
import UnknownIcon from "@knime/styles/img/icons/file-question.svg";
import FileTextIcon from "@knime/styles/img/icons/file-text.svg";
import FolderIcon from "@knime/styles/img/icons/folder.svg";
import NodeWorkflowIcon from "@knime/styles/img/icons/node-workflow.svg";
import PrivateSpaceIcon from "@knime/styles/img/icons/private-space.svg";
import UserIcon from "@knime/styles/img/icons/user.svg";
import UsersIcon from "@knime/styles/img/icons/users.svg";
import WorkflowNodeStackIcon from "@knime/styles/img/icons/workflow-node-stack.svg";
import WorkflowIcon from "@knime/styles/img/icons/workflow.svg";

import type { RepositoryItem, Space } from "../api/types";

export const useSpaceIcons = () => {
  const getSpaceGroupIcon = (spaceGroup: { type: "USER" | "TEAM" }) => {
    const icons = {
      TEAM: markRaw(UsersIcon),
      USER: markRaw(UserIcon),
    };

    return icons[spaceGroup.type] ?? UserIcon;
  };

  const getSpaceIcon = (space: Space) =>
    space.private ? markRaw(PrivateSpaceIcon) : markRaw(CubeIcon);

  const getSpaceItemIcon = (type: RepositoryItem["type"] | "Unknown") => {
    const typeIcons = {
      WorkflowGroup: markRaw(FolderIcon),
      Workflow: markRaw(WorkflowIcon),
      Component: markRaw(NodeWorkflowIcon),
      WorkflowTemplate: markRaw(WorkflowNodeStackIcon),
      Data: markRaw(FileTextIcon),
    };

    return typeIcons[type] ?? markRaw(UnknownIcon);
  };

  return {
    getSpaceGroupIcon,
    getSpaceIcon,
    getSpaceItemIcon,
  };
};
