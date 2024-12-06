import type { ExtensionConfig } from "../types";

const baseConfig = {
  nodeId: "0:0:7",
  projectId: "knime workflow",
  workflowId: "root:10",
  extensionType: "view" as const,
  nodeInfo: {
    nodeAnnotation: "",
    nodeState: "executed",
    nodeName: "Scatter Plot",
  },
  hasNodeView: false,
};

export const componentExtensionConfig: ExtensionConfig = {
  ...baseConfig,
  resourceInfo: {
    id: "org.knime.base.views.scatterplot.ScatterPlotNodeFactory",
    type: "SHADOW_APP",
    url: "http://localhost:8080/my_widget.html",
  },
};

export const iFrameExtensionConfig: ExtensionConfig = {
  ...baseConfig,
  resourceInfo: {
    id: "org.knime.base.views.scatterplot.ScatterPlotNodeFactory",
    type: "HTML",
    url: "org.knime.base.views.scatterplot.ScatterPlotNodeFactory/ScatterPlot/index.html",
  },
};
