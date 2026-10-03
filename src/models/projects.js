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
        TO_CHAR(project_date, 'YYYY-MM-DD') AS project_date, 
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

const createProject = async (title, description, location, date, organizationId) => {
  //console.log(title);
  //console.log(description);
  //console.log(location);
  //console.log(`here is the date:${date}`);
  //console.log(organizationId);
  // had to test data input because somehow it wasn't working... fun.

    const query = `
      INSERT INTO projects (title, description, location, project_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    // console.log(result);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

const updateProject = async(organization_id, title, description, location, date, project_id) => {
  try{
  const query = `
    UPDATE projects
    SET
      organization_id = $1,
      title = $2,
      description = $3,
      location = $4,
      project_date = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

    /**
   * apparently
   * $1 = project_id
   * $2 = Null?... how? it is suppposed to be organization_id
   * $3 = title: public challenge
   * $4 = description
   * $5 = location?!
   * $6 = Date?!
   * SOMEHOW?!
   * 
   * found out how, blame controller for WRONG inputs
   */

  const queryParams = [organization_id, title, description, location, date, project_id];
  const result = await db.query(query, queryParams);

  console.log(queryParams);
  console.log(result);

  if (result.rows.length  === 0) {
    throw new Error("Project not found")
  }
  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log(`Updated project with ID: ${project_id}`);
  }
  }
  catch {
    throw new Error("Database Connection not Available/Rejected")
  }
};


export {getAllProjects, getProjectsByOrganizationId, getProjectDetails, getUpcomingProjects, createProject, updateProject}  