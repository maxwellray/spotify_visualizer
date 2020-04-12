import * as _ from 'lodash';
import config from './config';

export const generateColorMap = (beats) => _.sortBy(beats, ['start']).reduce((acc, {start, duration, confidence, loudness_max}) => {
  const end = (duration + start) * config.TIME_IN_MS.SECOND;
  if (
    confidence < config.SPOTIFY_ANALYSIS_THRESHOLDS.MIN_CONFIDENCE ||
    loudness_max < config.SPOTIFY_ANALYSIS_THRESHOLDS.MIN_LOUDNESS
  ) {
    return [
      ...acc.slice(0,acc.length - 1),
      {
        ...acc[acc.length - 1],
        end
      }
    ]
  }
  const hexColor = generateRandomHexColor();
  return [
    ...acc,
    {
    start: start * config.TIME_IN_MS.SECOND,
    end: (duration + start) * config.TIME_IN_MS.SECOND,
    hexColor
  }]
}, []);

export const generateRandomHexColor = () => {
  return config.COLORS[Math.floor(Math.random() * config.COLORS.length)];
};
