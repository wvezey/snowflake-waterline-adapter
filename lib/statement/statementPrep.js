const Sequel = require('waterline-sequel');

const replaceDoubleQuotes = (statement) => {
  const statementParser = {
    hasQueries: (statment) => {
      return statement.queries.map( (query) => {
        
      })
    },
    hasDimensions: (statement) => {

    }
  }
};

module.exports = { function(statement, sqlOptions) {
  
  const modifiedStmt = replaceDoubleQuotes(statment);

  }
}