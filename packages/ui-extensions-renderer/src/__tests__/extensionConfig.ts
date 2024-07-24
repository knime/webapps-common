import { ExtensionTypes, RenderingType } from "@knime/ui-extension-service";
import type { ExtensionConfig } from "../types/ExtensionConfig";
import { ResourceTypes } from "../types/ResourceTypes";

const baseConfig = {
  nodeId: "0:0:7",
  projectId: "knime workflow",
  workflowId: "root:10",
  extensionType: ExtensionTypes.VIEW,
  nodeInfo: {
    nodeAnnotation: "",
    nodeState: "executed",
    nodeName: "Scatter Plot",
  },
  hasNodeView: false,
  renderingConfig: { type: RenderingType.DEFAULT },
};

export const componentExtensionConfig: ExtensionConfig = {
  ...baseConfig,
  resourceInfo: {
    id: "org.knime.base.views.scatterplot.ScatterPlotNodeFactory",
    type: ResourceTypes.SHADOW_APP,
    url: "http://localhost:8080/my_widget.html",
  },
};

export const iFrameExtensionConfig: ExtensionConfig = {
  ...baseConfig,
  resourceInfo: {
    id: "org.knime.base.views.scatterplot.ScatterPlotNodeFactory",
    type: ResourceTypes.HTML,
    url: "org.knime.base.views.scatterplot.ScatterPlotNodeFactory/ScatterPlot/index.html",
  },
};
