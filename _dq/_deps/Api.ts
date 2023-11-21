// curated dependencies for third party api integrations

// npm
import { retrieveNpmStats } from '»/npm.stats-package.ts';

export const NPM = {
  pkgStatsDownloaded: retrieveNpmStats
}