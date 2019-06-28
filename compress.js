// `loader` is a loader object from
// https://webpack.js.org/api/loaders/#the-loader-context
function adapter(loader) {
    try {
        var zlib = require('zlib');
        if (zlib.hasOwnProperty('brotliCompress')) {
            return zlib.brotliCompress;
        }
    } catch (err) {}

    try {
        loader.emitWarning('warning: couldn\'t find native brotli support in zlib library. trying to fall back to iltorb.');
        var iltorb = require('iltorb');
        return iltorb.compress;
    } catch (err) {
        loader.emitWarning('warning: couldn\'t load iltorb library. trying to fall back to brotli.js.');
        loader.emitWarning(err);

        try {
            var brotli = require('brotli');
            return function (content, options, callback) {
                var result = brotli.compress(content, options);
                callback(null, result);
            }
        } catch (err) {
            throw new Error('iltorb or brotli not found. See https://github.com/mynameiswhm/brotli-webpack-plugin for details.');
        }
    }
}

module.exports = adapter;
