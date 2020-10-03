
exports.up = function(knex) {
  return knex.schema.createTable('users',tbl=>{
      tbl.increments();
      tbl.text('username').notNull()
      tbl.text('password').notNull()
      tbl.text('department')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
};
