# snowflake-waterline-adapter

Translates feathersjs query language into Snowflake SQL through the Waterline ORM.

Rather than using the waterline-sequel package for sql translation, it installs waterline-sequel-snowflake, for db-specific syntax.

At this time, the adapter supports only the find() method. Please feel free to contribute.

The configuration options passed into the Sequel translator are:

- escapeCharacter: double quotes
- criteriaWrapper: single quote

Snowflake requires double quotes for database, table, view and column names; and single quotes for where clause strings.
