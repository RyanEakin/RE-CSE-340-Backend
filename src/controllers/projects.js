import { body, validationResult } from 'express-validator';

import { getCategoriesByProjectId} from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { getAllProjects, getProjectsByOrganizationId, getProjectDetails, getUpcomingProjects, createProject, updateProject } from '../models/projects.js';

const projectPage = async (req, res) => {
    const project_num = 5;
    const projects = await getUpcomingProjects(project_num);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjDetailsPage = async (req,res) => {
    const projectId = req.params.id;
    const projDetails = await getProjectDetails(projectId);
    const catDetails = await getCategoriesByProjectId(projectId);
    const title = 'Project Details';

    res.render('proj_details', {title, projDetails, catDetails});

};

const showNewProjForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new_project', { title, organizations });
}

const processNewProjForm = async (req, res) => {
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

        // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new_project');
    }

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new_project');
    }
}

const showEditProjForm = async (req,res) => {
    const projectId = req.params.id;
    const projDetails = await getProjectDetails(projectId);
    const orgDetails = await getAllOrganizations();

    const title = 'Edit Project';
    res.render('proj_edit', {title, projDetails, orgDetails});
};

const processEditProjForm = async (req,res) => {
    const projectId = req.params.id;
    const { organizationId, title, description, location, date } = req.body;
    // always remember to name the variables TO the names within the BODY of the html
    
    // testing for the date and if it ACTUALLY gets collected or not
    console.log("Request body:", req.body);
    //console.log("Submitted date:", req.body?.date);

    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect(`/edit_project/${organizationId}`);
    }

    await updateProject(organizationId, title, description, location, date, projectId);
    req.flash('success', 'Organization Edited successfully!');
    res.redirect(`/project/${projectId}`);
};

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

export {projectPage, showProjDetailsPage, showNewProjForm, processNewProjForm, projectValidation, processEditProjForm, showEditProjForm};