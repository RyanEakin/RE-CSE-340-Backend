import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT Project_Id, p.title, o.name, p.description, location, TO_CHAR(project_date, 'DD-MM-YYY') AS project_date, p.organization_id
      FROM public.projects AS p LEFT JOIN public.organizations AS o ON p.organization_id = o.organization_id;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}  