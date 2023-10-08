/**
 * Module for converting data types to Swagger data types.
 * @module toSwaggerType
 */

/**
 * Function for converting a data type to a Swagger data type.
 *
 * @param {string} type - The data type to convert.
 * @returns {string} - The corresponding Swagger data type.
 */
const toSwaggerType = (type) => {
  const inArrayRegexp = /array\(([^)]+)\)/i;
  if (inArrayRegexp.test(type)) {
    const dataType = toSwaggerType(type.match(inArrayRegexp)[1]);
    return `Array.<${dataType}>`;
  }

  const inSquareBracketsRegexp = /\[([^\]]+)]/i;
  if (inSquareBracketsRegexp.test(type)) {
    const dataType = toSwaggerType(type.match(inSquareBracketsRegexp)[1]);
    return `Array.<${dataType}>`;
  }

  const withSquareBracketsEndingRegexp = /^([^)]+)\[]/i;
  if (withSquareBracketsEndingRegexp.test(type)) {
    const dataType = toSwaggerType(type.match(withSquareBracketsEndingRegexp)[1]);
    return `Array.<${dataType}>`;
  }

  if (/string|text|date|dateonly|enum|uuid|inet|macaddr|cidr|geometry|range/i.test(type)) {
    return 'string';
  }

  if (/integer|bigint|real|decimal/i.test(type)) {
    return 'integer';
  }

  if (/float|real|double/i.test(type)) {
    return 'number';
  }

  if (/boolean/i.test(type)) {
    return 'boolean';
  }

  return type.replace(/\([^)]+\)/gi, '').toLowerCase();
};

export default toSwaggerType;
