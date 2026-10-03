import express from 'express';

import { indexPage } from '../src/controllers/index.js';

import { orgPage, showOrgDetailsPage, displayOrganizationForm, processOrganizationForm ,organizationValidation,showEditOrgForm, processEditOrgForm } from '../src/controllers/organizations.js';
import { projectPage, showProjDetailsPage, showNewProjForm, processNewProjForm, projectValidation } from '../src/controllers/projects.js';

import { categoryPage, showCatDetailsPage, showAssignCatForm, processAssignCatForm } from '../src/controllers/categories.js';

import { servError } from '../src/controllers/errors.js';


const router = express.Router();

/**
 * Routes
 */

router.get('/', indexPage);

router.get('/organizations', orgPage);
router.get('/organization/:id', showOrgDetailsPage);

router.get('/projects', projectPage);
router.get('/project/:id',showProjDetailsPage);

router.get('/categories',categoryPage);
router.get('/category/:id',showCatDetailsPage);

router.get('/new_organization', displayOrganizationForm);
router.post('/new_organization', organizationValidation, processOrganizationForm);

router.get('/edit_organization/:id', showEditOrgForm);
router.post('/edit_organization/:id', organizationValidation, processEditOrgForm);

router.get('/new_project', showNewProjForm);
router.post('/new_project', projectValidation, processNewProjForm);

router.get('/assign_categories/:projectId', showAssignCatForm);
router.post('/assign_categories/:projectId', processAssignCatForm);

router.get('/test-error',servError);

export default router;