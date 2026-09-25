import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT category_id, category_name FROM public.category
    `;

    const result = await db.query(query);

    return result.rows;
};

const getCategoryById = async(category_id) => {
    const query = `
      SELECT 
        category_id, 
        category_name
      FROM public.category 
      WHERE category_id = $1;
    `;
    const queryParam = [category_id];
    const result = await db.query(query, queryParam);

    return result.rows[0];
};

const getCategoriesByProjectId = async(project_id) => {
    const query = `
        SELECT 
        c.category_id, 
        c.category_name
      FROM public.projects AS p 
      INNER JOIN public.project_categories AS pc 
      ON p.project_id = pc.project_id
      INNER JOIN public.category AS c 
      ON c.category_id = pc.category_id
      WHERE p.project_id = $1;
    `;
    const queryParam = [project_id];
    const result = await db.query(query, queryParam);

    return result.rows;
};

const getProjectsByCategoryId = async(category_id) => {        
    const query = `
        SELECT 
        p.project_Id, 
        p.title, 
        p.description, 
        location, 
        TO_CHAR(project_date, 'DD-MM-YYYY') AS project_date, 
        p.organization_id
      FROM public.projects AS p 
      INNER JOIN public.project_categories AS pc 
      ON p.project_id = pc.project_id
      INNER JOIN public.category AS c 
      ON c.category_id = pc.category_id
      WHERE c.category_id = $1;
    `;
    const queryParam = [category_id];
    const result = await db.query(query, queryParam);

    return result.rows;
};

export {getAllCategories, getCategoriesByProjectId, getCategoryById, getProjectsByCategoryId}  