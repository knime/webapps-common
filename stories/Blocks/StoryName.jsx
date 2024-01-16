/* eslint-disable unused-imports/no-unused-imports */
import { useOf } from "@storybook/blocks";
import React from "react";

/**
 * A block that displays the story name or title from the of prop
 * - if a story reference is passed, it renders the story name
 * - if a meta reference is passed, it renders the stories' title
 * - if nothing is passed, it defaults to the primary story
 */
export const StoryName = ({ of }) => {
  const resolvedOf = useOf(of || "story", ["story", "meta"]);
  switch (resolvedOf.type) {
    case "story": {
      return <h1>HELLO CHRISTIAN{resolvedOf.story.name}</h1>;
    }
    case "meta": {
      return <h1>HELLO HELIAN{resolvedOf.preparedMeta.title}</h1>;
    }
  }
  return null;
};
