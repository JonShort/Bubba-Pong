function AssetManager() {
	var exports = this;

	exports.assets = [];

	exports.loadAsset = function(url, callback) {
		fabric.Image.fromURL(url, function(asset) {
			exports.assets.push({
				url: url,
				asset: asset
			});

			if (callback) {
				callback();
			}
		});
	};

	exports.loadAssets = function(urls, callback) {
		urls.forEach(function(url) {
			exports.loadAsset(url, function() {
				if (callback) {
					if (exports.assets.length === urls.length) {
						callback();
					}
				}
			});
		});
	};

	exports.getLoadedAsset = function(url) {
		for (var i = 0; i < exports.assets.length; i++) {
			if (exports.assets[i].url === url) {
				return exports.assets[i].asset;
			}
		}

		throw "Asset " + url + " is not loaded.";
	};
}