
const _registerConnection = require ('./connections/register');
const snowflake = require('snowflake-sdk');
const Sequel = require('waterline-sequel-snowflake');
const moment = require('moment');

module.exports = (function () {

  let connections = {};

  const sqlOptions = {
    parameterized: false,
    caseSensitive: false,
    casting: false,
    canReturnValues: false,
    escapeInserts: true,
    escapeCharacter: '`',
  };

  const adapter = {
    registerConnection: _registerConnection.configure(connections),

    find: function(connectionName, collectionName, options, cb, connection) {

      console.log('snowflake adapter::find', {options: options})

      /*
      console.log('snowflake adapter::find', {connections: connections})
      console.log('snowflake adapter::find', {connectionName: connectionName})
      console.log('snowflake adapter::find', {collectionName: collectionName})
      console.log('snowflake adapter::find', {options: options})
      console.log('snowflake adapter::find', {cb: cb})
      console.log('snowflake adapter::find', {connection: connection})
      */

      const connConfig = connections[connectionName];
      const schemaObj = connConfig.schemaObj;

      console.log('snowflake adapter::find; calling createConnection', {schemaObj: schemaObj})

      const conn = snowflake.createConnection(connConfig);
      const activeConn = conn.connect();

      //console.log({conn: conn});

      //const _collName = 'ACCESS_VIEWS.' + collectionName;

      const schemaName = {
        [collectionName]: connConfig.schemaName
      }
      sqlOptions.schemaName = schemaName;
      const sequel = new Sequel(schemaObj, sqlOptions);

      const readySql = sequel.find(collectionName, options);
      const readySqlQuery = readySql.query[0];

      //console.log('snowflake adapter::find', {collectionName: collectionName})
      //console.log('snowflake adapter::find', {'options.where.CAL_DT': options.where.CAL_DT})
      //console.log('snowflake adapter::find', {readySql: readySql})
      console.log('snowflake adapter::find', {readySqlQuery: readySqlQuery})
      //console.log('snowflake adapter::find', {readySqlValues: readySqlValues})

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

            //console.log('snowflake adapter::find', {'returnVal.rowCount':returnVal.rowCount})
            //console.log('snowflake adapter::find', {'returnVal.stmt':returnVal.stmt})

            //const row = returnVal.rows[0];
            //const dateObj = row['DATA_AS_OF_DT']

            returnVal.rows = rows.map( (row) => {

              if(row['DATA_AS_OF_DT'] !== 'NULL') {

                //console.log({"row['DATA_AS_OF_DT']": row['DATA_AS_OF_DT']})
                return row;
              }
            })

            //console.log('snowflake adapter::find', {'returnVal.rows.length':returnVal.rows.length});


            //console.log('snowflake adapter::find', {dateObj:dateObj})

            activeConn.destroy();

            return cb(null, returnVal);
          }
        }
      });

      //console.log('snowflake adapter::find', {result: result})

    }
    

  }
  return adapter;

})();