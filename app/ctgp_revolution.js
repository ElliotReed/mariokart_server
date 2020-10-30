const _ = require("lodash");

// Import helper functions
const {
  compose,
  composeAsync,
  extractNumber,
  enforceHttpsUrl,
  fetchHtmlFromUrl,
  extractFromElems,
  fromPairsToObject,
  fetchElemInnerText,
  fetchElemAttribute,
  extractUrlAttribute,
} = require("./helpers");

// scotch.io (Base URL)
const CTGP_REVOLUTION_BASE = "http://wiki.tockdom.com/wiki";

///////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/*
  Resolves the url as relative to the base scotch url
  and returns the full URL
*/
const ctgpRelativeUrl = (url) =>
  _.isString(url)
    ? `${CTGP_REVOLUTION_BASE}${url.replace(/^\/*?/, "/")}`
    : null;

/*
_ A composed function that extracts a url from element attribute,
_ resolves it to the Scotch base url and returns the url with https
 */
const extractScotchUrlAttribute = (attr) =>
  compose(enforceHttpsUrl, ctgpRelativeUrl, fetchElemAttribute(attr));
