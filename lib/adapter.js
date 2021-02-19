
const _registerConnection = require ('./connections/register');
const snowflake = require('snowflake-sdk');
const Sequel = require('waterline-sequel-snowflake');

module.exports = (function () {

  let connections = {};

  const sqlOptions = {
    parameterized: false,
    caseSensitive: false,
    casting: false,
    canReturnValues: false,
    escapeInserts: true,
    escapeCharacter: '"',
    criteriaWrapper: "'"
  };

  const adapter = {
    registerConnection: _registerConnection.configure(connections),

    find: function(connectionName, collectionName, options, cb, connection) {

      const connConfig = connections[connectionName];
      const schemaObj = connConfig.schemaObj;
      const conn = snowflake.createConnection(connConfig);
      const activeConn = conn.connect();

      const schemaName = {
        [collectionName]: connConfig.schemaName
      }
      sqlOptions.schemaName = schemaName;
      const sequel = new Sequel(schemaObj, sqlOptions);

      const readySql = sequel.find(collectionName, options);
      const readySqlQuery = readySql.query[0];

      activeConn.execute({sqlText: readySqlQuery,
        fetchAsString: ['Date'],
        complete: function (err, stmt, rows) {
          if (err) {
            console.log(`Failed to execute statement due to the following error: ${err.message}. stmt: ${stmt}`);
            return cb(err);
          } else {
            const returnVal = {};
            returnVal.rowCount = rows.length;
            returnVal.stmt = stmt;
            returnVal.rows = [];

            returnVal.rows = rows.map( (row) => {
              if(row['DATA_AS_OF_DT'] !== 'NULL') {
                return row;
              }
            })

            activeConn.destroy();

            return cb(null, returnVal);
          }
        }
      });
    }
  }
  return adapter;

})();