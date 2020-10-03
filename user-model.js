const db = require('./config');
function find(){
    return db('users').select('id','username','department')
}

function findById(id){
    return db('users')
    .select('id','username','department')
    .where('id',id)
}

async function add(user){
    const [id] = await db('users').insert(user)
    return findById(id)
}

function findBy(filter){
    return db('users')
    .select('id','username','password','department')
    .where(filter)
}
module.exports = {
    find,
    findById,
    add,
    findBy
}