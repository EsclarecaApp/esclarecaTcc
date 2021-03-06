const connection = require('../database/connection')

module.exports = {
    async create(request, response) {
        const { titulo, descricao, tags } = request.body;
        const { user_id } = request.headers;

        //Testa se algum campo obrigatório não foi preenchido
        if (!user_id) {
            return response.status(400).json({ error: 'Login inválido' })
        }
        //Testa se algum campo obrigatório não foi preenchido
        if (!titulo || !descricao || !tags) {
            return response.status(400).json({ error: 'Algum campo não foi preenchido' })
        }

        const [id] = await connection('posts').insert({
            titulo, descricao, user_id
        })
        //Se o usuário foi inserido com sucesso, insere as tags
        if (id) {
            tagsArray = tags.split(',')
            post_id = id

            //Itera o mapa de tags recebido para inserir o id do usuário
            const tagsUser = tagsArray.map(t => ({ tag: t.trim().toLowerCase(), post_id }))
            await connection('posts_tags').insert(tagsUser)
        }
        return response.json({ id })
    },
    async index(request, response) {
        //Todo: é interessante ignorar os posts do usuário?
        const { user_id } = request.headers;

        //Páginação
        const { page = 1 } = request.query;
        const [count] = await connection('posts').count()

        //Testa se algum campo obrigatório não foi preenchido
        if (!user_id) {
            return response.status(400).json({ error: 'Login inválido' })
        }

        //Recupera as tags do usuário e depois separa em uma string para usar no IN no select
        const tagUsuario = await connection('users_tags').where('user_id', user_id).select('tag').pluck('tag')

        //Recupera as tags dos posts e depois separa em uma string para usar no IN no sele
        const post_Ids = await connection('posts_tags').whereIn('tag', tagUsuario).select('post_id').pluck('post_id')

        //Busca os posts com base nos ids dos posts_tags que recuperou
        const posts = await connection('posts').whereIn('posts.id', post_Ids).select('posts.*', connection.raw(`GROUP_CONCAT([tag], ', ') as tag`))
            .join('posts_tags', { 'posts_tags.post_id': 'posts.id' }).groupBy('posts.id')
            .limit(5)
            .offset((page - 1) * 5)

        response.header('X-Total-Count', count['count(*)'])
        return response.json(posts)
    }
}