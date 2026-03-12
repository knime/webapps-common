export const buildLicenseCheckerOptions = ({
  parentRoot,
  config,
  customPath,
}) => ({
  start: parentRoot,
  production: false,
  onlyAllow: config.onlyAllow.join(";"),
  excludePackages: config.excludePackages.join(";"),
  customPath,
});

export const toUniqueSortedPackages = ({
  collectedPackages,
  manualPackages,
}) => {
  const allPackages = Object.values(collectedPackages).concat(manualPackages);

  const normalizedPackages = allPackages.map((pkg) => ({
    name: pkg.name,
    repository: pkg.repository ?? "",
    licenseText: pkg.licenseText ?? "",
  }));

  const allUniquePackages = [];

  normalizedPackages.forEach((pkg) => {
    const alreadyExists = allUniquePackages.some(
      (firstPkg) =>
        firstPkg.name.toLowerCase() === pkg.name.toLowerCase() &&
        firstPkg.repository?.toLowerCase() === pkg.repository.toLowerCase() &&
        firstPkg.licenseText?.replace(/\s+/g, "") ===
          pkg.licenseText.replace(/\s+/g, ""),
    );

    if (!alreadyExists) {
      allUniquePackages.push(pkg);
    }
  });

  allUniquePackages.sort((a, b) => a.name.localeCompare(b.name));

  return allUniquePackages;
};

export const throwOnLicenseError = ({ error }) => {
  if (!error) {
    return;
  }

  throw error;
};
