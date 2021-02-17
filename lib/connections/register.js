const { extractConfig } = require('snowflake-waterline-adapter/utils/connectionUtils');

module.exports = {};
module.exports.configure = (connections) => {

  return function registerConnection(connectionConfig, collections, cb) {

    let schema = {};

    for(const coll in collections) {
      const collection = collections[coll];
      const _schema = collection.waterline && collection.waterline.schema && collection.waterline.schema[collection.identity];
      schema[_schema.tableName] = _schema;
    }

    console.log('registerConnection', {schema: schema})
    
    connections[connectionConfig.identity] = {
      collections: collections,
      connection: {},
      schemaObj: schema,
    }
    Object.assign(connections[connectionConfig.identity], connectionConfig);

    /**
     * Placeholder for pool mgmt. Not sure if this is needed
     * with Snowflake, since the connection is over https. Might
     * be socket mgmt required, however.
     */

    return cb();
  }
}