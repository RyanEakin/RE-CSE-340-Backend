import { getAllProjects, getProjectsByOrganizationId, getProjectDetails, getUpcomingProjects } from '../models/projects.js';

const projectPage = async (req, res) => {
    const project_num = 5;
    const projects = await getUpcomingProjects(project_num);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjDetailsPage = async (req,res) => {
    const projectId = req.params.id;
    const projDetails = await getProjectDetails(projectId);
    const title = 'Project Details';

    res.render('proj_details', {title, projDetails});

};

export {projectPage, showProjDetailsPage};