exports.up = function(knex) {
    return knex.schema.createTable('posts_tags', function (table){
      table.increments('id');

      table.string('tag').notNullable();
      // table.integer('tag_id').notNullable();
      // table.foreign('tag_id').references('id').inTable('tags');

      table.integer('post_id').notNullable();
      table.foreign('post_id').references('id').inTable('posts');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('posts_tags');
  };
  