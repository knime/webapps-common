import { composePaths } from "./paths";

/**
 * A running variable during the resolution of which deprecated flow variables
 * point to which widgets
 */
export interface DeprecatedConfigPathsCandidate {
  /**
   * The paths relative to which paths in targetConfigPaths and
   * deprecatedConfigPaths are to be understood
   */
  basePaths: string[];
  /**
   * An array of paths. Each path is an array of string config keys to a
   * non-deprecates / normal config relative to all base paths
   */
  targetConfigPaths: string[][];
  /**
   * An array of deprecated config paths (relative to basePaths)
   */
  deprecatedConfigPaths: string[];
  /**
   * The current index up to which the targetConfigKeys are traversed
   */
  stepNumber: number;
}

export const createNewCandidate = (
  part: {
    new: string[][];
    deprecated: string[][];
  },
  configPaths: string[],
): DeprecatedConfigPathsCandidate => ({
  basePaths: configPaths,
  stepNumber: 0,
  targetConfigPaths: part.new,
  deprecatedConfigPaths: part.deprecated.map((keys) =>
    keys.reduce(composePaths, ""),
  ),
});

/**
 * Filter out the target paths which are not realized by the given next segments and increase the stepNumber
 */
const updateCandidate = (
  candidate: DeprecatedConfigPathsCandidate,
  nextPathSegmentsSet: Set<string>,
) => {
  candidate.targetConfigPaths = candidate.targetConfigPaths.filter((target) => {
    const targetStepKey = target.at(candidate.stepNumber);
    if (targetStepKey) {
      return nextPathSegmentsSet.has(targetStepKey);
    }
    return true;
  });
  candidate.stepNumber += 1;
  return candidate;
};

const hasTargetPathsLeft = ({
  targetConfigPaths,
}: DeprecatedConfigPathsCandidate) => targetConfigPaths.length > 0;

export const updateCandidates = (
  candidates: DeprecatedConfigPathsCandidate[],
  nextPathSegmentsSet: Set<string>,
) => {
  return candidates //
    .map((candidate) => updateCandidate(candidate, nextPathSegmentsSet)) //
    .filter(hasTargetPathsLeft);
};

interface ProcessedDeprecatedConfigPathsCandidate {
  targetConfigPaths: string[];
  deprecatedConfigPaths: string[];
}

const process = (candidate: DeprecatedConfigPathsCandidate) => {
  const targetConfigPaths = candidate.basePaths.flatMap((basePath) =>
    candidate.targetConfigPaths.map((target) =>
      [basePath, ...target].reduce(composePaths, ""),
    ),
  );
  const deprecatedConfigPaths = candidate.basePaths.flatMap((basePath) =>
    candidate.deprecatedConfigPaths.map((deprecatedPath) =>
      composePaths(basePath, deprecatedPath),
    ),
  );
  return {
    targetConfigPaths,
    deprecatedConfigPaths,
  };
};

const findDeprecatedConfigPathsForCandidate = (
  {
    targetConfigPaths,
    deprecatedConfigPaths,
  }: ProcessedDeprecatedConfigPathsCandidate,
  configPath: string,
): string[] => {
  if (
    targetConfigPaths.filter((targetConfigPath) =>
      configPath.startsWith(targetConfigPath),
    ).length > 0
  ) {
    return deprecatedConfigPaths;
  }
  return [];
};

const findDeprecatedConfigPaths = (
  candidates: ProcessedDeprecatedConfigPathsCandidate[],
  configPath: string,
): string[] => {
  return candidates.flatMap((candidate) =>
    findDeprecatedConfigPathsForCandidate(candidate, configPath),
  );
};

export const toConfigPathsWithDeprecatedConfigPaths = (
  configPaths: string[],
  candidates: DeprecatedConfigPathsCandidate[],
) => {
  const processedCandidates = candidates.map(process);
  return configPaths.map((configPath) => ({
    configPath,
    deprecatedConfigPaths: findDeprecatedConfigPaths(
      processedCandidates,
      configPath,
    ),
  }));
};
