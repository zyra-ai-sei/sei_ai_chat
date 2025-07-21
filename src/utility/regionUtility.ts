import axios from "axios";
import ApplicationConfig from "../ApplicationConfig";
import { getLocalStorage, saveToLocalStorage } from "./localStorage";
import { FixTypeLater } from "../interface/common.interface";

export function getRegionByIP() {
  const regionCacheKey = "CURRENT_REGION";
  const regionCache = getLocalStorage(regionCacheKey);

  const getRegionUrl = `https://api.ip.sb/geoip`;

  return new Promise((resolve) => {
    if (regionCache) {
      resolve(regionCache);
    } else {
      axios
        .get(getRegionUrl)
        .then((response) => {
          // log.debug(`response:`);
          // log.debug(response.request.responseText);

          if (response && response.data) {
            const data = response.data;

            const countryCode = data?.country_code || "N/A";
            saveToLocalStorage(regionCacheKey, countryCode, 5 * 60 * 1000);
            resolve(countryCode);
          } else {
            resolve("N/A");
          }
        })
        .catch((e) => {
          console.error(e);

          resolve("N/A");
        });
    }
  });
}

export function checkBlockedRegion(callback: FixTypeLater) {
  let blockedRegions = ApplicationConfig.blockedRegions;

  const blockedRegionsEnv = import.meta.env.VITE_BLOCKED_REGIONS;
  if (blockedRegionsEnv) {
    blockedRegions = blockedRegionsEnv.split(",");
  }

  if (!blockedRegions.length) {
    callback(true);
    return;
  }

  getRegionByIP()
    .then((countryCode: FixTypeLater) => {
      if (blockedRegions.includes(countryCode)) {
        callback(false);
      } else {
        callback(true);
      }
    })
    .catch(() => {
      callback(true);
    });
}
