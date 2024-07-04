const readInstalled = require("read-installed-packages");

module.exports = function (basePath, filterByScope, callback) {
  const flatten = (options) => {
    let json = options.deps;
    let data = options.data;
    let key = `${json.name}@${json.version}`;
    data[key] = true;
    if (json.dependencies) {
      Object.keys(json.dependencies).forEach(function (name) {
        let childDependency = json.dependencies[name];
        let dependencyId = `${childDependency.name}@${childDependency.version}`;
        if (data[dependencyId]) {
          // already exists
          return;
        }
        data = flatten({ deps: childDependency, data });
      });
    }
    if (!json.name || !json.version) {
      delete data[key];
    }
    return data;
  };

  readInstalled(basePath, {}, (err, data) => {
    if (err) {
      throw err;
    }
    let list = Object.keys(
      flatten({
        deps: data,
        data: {},
      }),
    );
    if (filterByScope) {
      list = list.filter((item) => item.startsWith(filterByScope));
    }
    callback(list);
  });
};
