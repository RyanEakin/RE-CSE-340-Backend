import db from './db.js'
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
    SELECT u.user_id, u.email, u.password_hash, r.role_name 
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1
`;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    //console.log(email);
    //console.log(password);

    const user = await findUserByEmail(email);

    //console.log(user);
 
    if (user === null) {
        return null;
    }

    const auth = await verifyPassword(password, user.password_hash);

    if (auth === true){
        return user;
    }
    else {
        return null;
    }
};

//created this function due to a lack of any other function that did the SAME, without needing their email BEFOREHAND.
const getUserDetails = async () => {
    const query = `
    SELECT u.user_id, u.name, u.email, r.role_name 
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    ORDER BY u.user_id
    `;

    const result = await db.query(query);

    return result.rows;
};


//========================================//
//         Volunteering functions         //
//========================================//


const assignVolunteer = async(userId, projectId) => {
    const query = `
        INSERT INTO volunteers (user_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [userId, projectId]);
};

const listProjByUserId = async(userId) => {
    const query = `
      SELECT 
        p.project_id,
        p.title,
        p.description,
        p.location,
        p.project_date,
        p.organization_id
      FROM public.projects AS p 
      INNER JOIN public.volunteers AS v 
      ON p.project_id = v.project_id
      INNER JOIN public.users AS u 
      ON u.user_id = v.user_id
      WHERE u.user_id = $1;
    `;

    const queryParam = [project_id];
    const result = await db.query(query, queryParam);

    return result.rows;
};

const removeVolunteer = async(userId,projectId) => {
    const deleteQuery = `
        DELETE FROM volunteers
        WHERE user_id = $1 AND project_id = $2;
    `;
    await db.query(deleteQuery, [userId,projectId]);
};


export { createUser, authenticateUser, getUserDetails, assignVolunteer, listProjByUserId, removeVolunteer };