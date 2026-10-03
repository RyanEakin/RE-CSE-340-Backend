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

const assignCategoryToProject = async(category_id, project_id) =>{
  const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [category_id, project_id])
};

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};


const createCategory = async (name) => {


    const query = `
      INSERT INTO category 
      (category_name)  Values($1)
      RETURNING category_id;
    `;

  const queryParams = [name];
    const result = await db.query(query, queryParams);

    // console.log(result);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].category_id);
    }

    return result.rows[0].category_id;
};

const updateCategory = async(Id,name) => {
  try{
  const query = `
    UPDATE categories
    SET
      category_name = $2,
    WHERE category_id = $1
    RETURNING category_id;
  `;

  const queryParams = [Id,name];
  const result = await db.query(query, queryParams);

  console.log(queryParams);
  console.log(result);

  if (result.rows.length  === 0) {
    throw new Error("Category not found")
  }
  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log(`Updated project with ID: ${category_id}`);
  }
  }
  catch {
    throw new Error("Database Connection not Available/Rejected")
  }
};


export {getAllCategories, getCategoriesByProjectId, getCategoryById, getProjectsByCategoryId, updateCategoryAssignments, createCategory, updateCategory}  