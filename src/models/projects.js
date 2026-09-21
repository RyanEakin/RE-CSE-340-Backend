import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT Project_Id, p.title, o.name, p.description, location, TO_CHAR(project_date, 'DD-MM-YYYY') AS project_date, p.organization_id
      FROM public.projects AS p LEFT JOIN public.organizations AS o ON p.organization_id = o.organization_id;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date
        FROM public.projects
        WHERE organization_id = $1
        ORDER BY project_date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

export {getAllProjects, getProjectsByOrganizationId}  