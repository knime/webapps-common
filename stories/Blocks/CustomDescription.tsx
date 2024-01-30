import type { Component, FC } from "react";
import React, { useContext } from "react";
import { str } from "@storybook/docs-tools";
import { deprecate } from "@storybook/client-logger";

import {
  type Of,
  useOf,
  type DocsContextProps,
  DocsContext,
  Markdown,
} from "@storybook/blocks";

export enum DescriptionType {
  INFO = "info",
  NOTES = "notes",
  DOCGEN = "docgen",
  AUTO = "auto",
}

type Notes = string | any;
type Info = string | any;

const DEPRECATION_MIGRATION_LINK =
  "https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#description-block-parametersnotes-and-parametersinfo";

interface DescriptionProps {
  /**
   * Specify where to get the description from. Can be a component, a CSF file or a story.
   * If not specified, the description will be extracted from the meta of the attached CSF file.
   */
  of?: Of;
  /**
   * @deprecated Manually specifying description type is deprecated. See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#description-block-parametersnotes-and-parametersinfo
   */
  type?: DescriptionType;
  /**
   * @deprecated The 'markdown' prop on the Description block is deprecated. See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#description-block-parametersnotes-and-parametersinfo
   */
  markdown?: string;
  /**
   * @deprecated The 'children' prop on the Description block is deprecated. See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#description-block-parametersnotes-and-parametersinfo
   */
  children?: string;
}

const getNotes = (notes?: Notes) =>
  notes &&
  (typeof notes === "string" ? notes : str(notes.markdown) || str(notes.text));

const getInfo = (info?: Info) =>
  info && (typeof info === "string" ? info : str(info.text));

const noDescription = (component?: Component): string | null => null;

const getDescriptionFromResolvedOf = (
  resolvedOf: ReturnType<typeof useOf>,
): string | null => {
  switch (resolvedOf.type) {
    case "story": {
      return resolvedOf.story.parameters.docs?.description?.story || null;
    }
    case "meta": {
      const { parameters, component } = resolvedOf.preparedMeta;
      const metaDescription = parameters.docs?.description?.component;
      if (metaDescription) {
        return metaDescription;
      }
      return (
        parameters.docs?.extractComponentDescription?.(component, {
          component,
          parameters,
        }) || null
      );
    }
    case "component": {
      const {
        component,
        projectAnnotations: { parameters },
      } = resolvedOf;
      return (
        parameters.docs?.extractComponentDescription?.(component, {
          component,
          parameters,
        }) || null
      );
    }
    default: {
      throw new Error(
        `Unrecognized module type resolved from 'useOf', got: ${
          (resolvedOf as any).type
        }`,
      );
    }
  }
};

const getDescriptionFromDeprecatedProps = (
  { type, markdown, children }: DescriptionProps,
  { storyById }: DocsContextProps<any>,
): string => {
  const { component, parameters } = storyById();
  if (children || markdown) {
    return children || markdown;
  }
  const { notes, info, docs } = parameters;
  if (Boolean(notes) || Boolean(info)) {
    deprecate(
      `Using 'parameters.notes' or 'parameters.info' properties to describe stories is deprecated. See ${DEPRECATION_MIGRATION_LINK}`,
    );
  }

  const { extractComponentDescription = noDescription, description } =
    docs || {};

  // override component description
  const componentDescriptionParameter = description?.component;
  if (componentDescriptionParameter) {
    return componentDescriptionParameter;
  }

  switch (type) {
    case DescriptionType.INFO:
      return getInfo(info);
    case DescriptionType.NOTES:
      return getNotes(notes);
    case DescriptionType.DOCGEN:
    case DescriptionType.AUTO:
    default:
      return extractComponentDescription(component, {
        component,
        ...parameters,
      });
  }
};

const DescriptionContainer: FC<DescriptionProps> = (props) => {
  const { of, type, markdown: markdownProp, children } = props;

  if ("of" in props && of === undefined) {
    throw new Error(
      "Unexpected `of={undefined}`, did you mistype a CSF file reference?",
    );
  }
  const context = useContext(DocsContext);
  const resolvedOf = useOf(of || "meta");
  let markdown;
  if (type || markdownProp || children) {
    // pre 7.0 mode with deprecated props
    markdown = getDescriptionFromDeprecatedProps(props, context);
  } else {
    // 7.0 mode with new 'of' prop
    // pre 7.0 with only 'of' prop only supported referencing a component, which 7.0 supports as well here
    markdown = getDescriptionFromResolvedOf(resolvedOf);
  }
  if (type) {
    deprecate(
      `Manually specifying description type is deprecated. See ${DEPRECATION_MIGRATION_LINK}`,
    );
  }
  if (markdownProp) {
    deprecate(
      `The 'markdown' prop on the Description block is deprecated. See ${DEPRECATION_MIGRATION_LINK}`,
    );
  }
  if (children) {
    deprecate(
      `The 'children' prop on the Description block is deprecated. See ${DEPRECATION_MIGRATION_LINK}`,
    );
  }
  return markdown ? <Markdown>{markdown}</Markdown> : null;
};

export { DescriptionContainer as Description };
