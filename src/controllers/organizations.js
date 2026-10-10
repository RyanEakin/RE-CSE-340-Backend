import { body, validationResult } from 'express-validator';

import { getAllOrganizations, getOrganizationDetails,createOrganization, updateOrganizations } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';


// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];


const orgPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

const showOrgDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('org_details', {title, organizationDetails, projects});
};

const displayOrganizationForm = async (requestAnimationFrame,res) => {
    const title = 'Add New Organization';
    res.set('Cache-Control', 'no-store');
    // this is used to remove the cached page from memory when logging out, so that back one page info leaks DON'T occur

    res.render('new_organization', {title});
};

const processOrganizationForm = async (req, res) => {
    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

    res.set('Cache-Control', 'no-store');
    // this is used to remove the cached page from memory when logging out, so that back one page info leaks DON'T occur

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${organizationId}`);
};

const showEditOrgForm = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    res.set('Cache-Control', 'no-store');
    // this is used to remove the cached page from memory when logging out, so that back one page info leaks DON'T occur

    const title = 'Edit Organization';
    res.render('org_edit', { title, organizationDetails });
};

const processEditOrgForm = async (req, res) => {
    const organizationId = req.params.id;
    const { name, description, contactEmail, logoFilename } = req.body;

    res.set('Cache-Control', 'no-store');
    // this is used to remove the cached page from memory when logging out, so that back one page info leaks DON'T occur

    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect(`/edit_organization/${organizationId}`);
    }

    await updateOrganizations(name, description, contactEmail, logoFilename, organizationId);
    req.flash('success', 'Organization Edited successfully!');
    res.redirect(`/organization/${organizationId}`);
};

export {orgPage, showOrgDetailsPage, displayOrganizationForm, processOrganizationForm, organizationValidation ,showEditOrgForm, processEditOrgForm};