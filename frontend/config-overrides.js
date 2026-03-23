const { override } = require('customize-cra');

const disableSourceMapLoaderForNodeModules = (config) => {
  config.module.rules.forEach((rule) => {
	if (rule.oneOf) {
	  rule.oneOf.forEach((oneOfRule) => {
		if (oneOfRule.use && Array.isArray(oneOfRule.use)) {
		  oneOfRule.use.forEach((use, index) => {
			if (use.loader && use.loader.includes('source-map-loader')) {
			  oneOfRule.use[index] = {
				...use,
				enforce: 'pre',
				exclude: /node_modules/,
			  };
			}
		  });
		}
	  });
	}
  });
  return config;
};

module.exports = override(disableSourceMapLoaderForNodeModules);
