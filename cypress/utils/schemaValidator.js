const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function validarSchema(schema, data) {
  const validate = ajv.compile(schema);
  const valido = validate(data);
  if (!valido) {
    const detalhes = (validate.errors || [])
      .map((err) => `${err.instancePath || '/'} ${err.message}`)
      .join('; ');
    expect(valido, `schema invalido: ${detalhes}`).to.eq(true);
  }
  return true;
}

module.exports = { validarSchema };
