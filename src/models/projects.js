import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT 
        Project_Id, 
        p.title, 
        o.name, 
        p.description, 
        location, 
        TO_CHAR(project_date, 'DD-MM-YYYY') AS project_date, 
        p.organization_id
      FROM public.projects AS p 
      LEFT JOIN public.organizations AS o 
      ON p.organization_id = o.organization_id;
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
          TO_CHAR(project_date, 'DD-MM-YYYY') AS project_date
        FROM public.projects
        WHERE organization_id = $1
        ORDER BY project_date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getUpcomingProjects = async (projectNum) => {
    const query = `
        SELECT 
        project_Id, 
        p.title, 
        o.name, 
        p.description, 
        location, 
        TO_CHAR(project_date, 'DD-MM-YYYY') AS project_date, 
        p.organization_id
      FROM public.projects AS p 
      LEFT JOIN public.organizations AS o 
      ON p.organization_id = o.organization_id
      ORDER BY project_date
      LIMIT $1;
    `;

    const queryParam = [projectNum];
    const result = await db.query(query, queryParam);

    return result.rows;
};

const getProjectDetails = async (project_id) => {
    const query = `
        SELECT 
        project_Id, 
        p.title, 
        p.description, 
        location, 
        TO_CHAR(project_date, 'DD-MM-YYYY') AS project_date, 
        p.organization_id,
        o.name
      FROM public.projects AS p 
      LEFT JOIN public.organizations AS o 
      ON p.organization_id = o.organization_id
      WHERE project_Id = $1;
    `;
    const queryParam = [project_id];
    const result = await db.query(query, queryParam);

    return result.rows;
};

export {getAllProjects, getProjectsByOrganizationId, getProjectDetails, getUpcomingProjects}  