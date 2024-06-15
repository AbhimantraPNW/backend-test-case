import mysql from "mysql2/promise"

export default mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Abhs3bZ4M',
    database: "backend_tes_eigen"
})