export const PARSE_RANDOM = {
  BOOL: ['TRUE','FALSE'],
  DIR: [''],
  DIRECTION_THREE_DIMENAIONAL:[''],
  DIRECTION_CARDINAL:['NORTH','SOUTH','EAST','WEST'],
  DIRECTION_COMPASS:[''],
}
// extensions
PARSE_RANDOM.DIRECTION_COMPASS = [...PARSE_RANDOM.DIRECTION_CARDINAL,'NORTHEAST','NORTHWEST','SOUTHEAST','SOUTHWEST','CENTER']
PARSE_RANDOM.DIRECTION_THREE_DIMENAIONAL = [...PARSE_RANDOM.DIRECTION_COMPASS,'DOWN','UP']

// shorthand
PARSE_RANDOM.DIR = PARSE_RANDOM.DIRECTION_CARDINAL
