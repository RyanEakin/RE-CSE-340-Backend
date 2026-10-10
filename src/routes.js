import express from 'express';

import { ShowUserRegForm, ProcessUserRegForm, regValidation, userValidation, showLogin, processLogin, processLogout, showDashboard, requireCred, requirePerm, showMngemntDashboard } from './controllers/users.js';

import { indexPage } from '../src/controllers/index.js';

import { orgPage, showOrgDetailsPage, displayOrganizationForm, processOrganizationForm ,organizationValidation,showEditOrgForm, processEditOrgForm } from '../src/controllers/organizations.js';
import { projectPage, showProjDetailsPage, showNewProjForm, processNewProjForm, projectValidation, showEditProjForm, processEditProjForm } from '../src/controllers/projects.js';

import { categoryPage, showCatDetailsPage, showAssignCatForm, processAssignCatForm, processNewCatForm, showNewCatForm, showEditCatForm, processEditCatForm, categoryValidation } from '../src/controllers/categories.js';

import { servError } from '../src/controllers/errors.js';


const router = express.Router();

/**
 * Routes
 */

///////////////////////////////////////////
//       Publicly Available Pages        //
///////////////////////////////////////////

router.get('/', indexPage);

router.get('/organizations', orgPage);
router.get('/organization/:id', showOrgDetailsPage);

router.get('/projects', projectPage);
router.get('/project/:id',showProjDetailsPage);

router.get('/categories',categoryPage);
router.get('/category/:id',showCatDetailsPage);

///////////////////////////////////////////
//          Organization Pages           //
///////////////////////////////////////////

router.get('/new_organization', requirePerm('admin'), displayOrganizationForm);
router.post('/new_organization', requirePerm('admin'), organizationValidation, processOrganizationForm);

router.get('/edit_organization/:id', requirePerm('admin'), showEditOrgForm);
router.post('/edit_organization/:id', requirePerm('admin'), organizationValidation, processEditOrgForm);

///////////////////////////////////////////
//             Project Pages             //
///////////////////////////////////////////

router.get('/new_project', requirePerm('admin'), showNewProjForm);
router.post('/new_project', requirePerm('admin'), projectValidation, processNewProjForm);

router.get('/edit_project/:id', requirePerm('admin'), showEditProjForm);
router.post('/edit_project/:id', requirePerm('admin'), projectValidation, processEditProjForm);

///////////////////////////////////////////
//            Category Pages             //
///////////////////////////////////////////

router.get('/assign_categories/:projectId', requirePerm('admin'), showAssignCatForm);
router.post('/assign_categories/:projectId', requirePerm('admin'), processAssignCatForm);

router.get('/new_categories', requirePerm('admin'), showNewCatForm);
router.post('/new_categories', requirePerm('admin'), categoryValidation, processNewCatForm);
// remember to add the validator TO the POST methods!

router.get('/edit_categories/:id', requirePerm('admin'), showEditCatForm);
router.post('/edit_categories/:id', requirePerm('admin'), categoryValidation, processEditCatForm);

///////////////////////////////////////////
//             Account Pages             //
///////////////////////////////////////////

router.get('/register',ShowUserRegForm);
router.post('/register', regValidation, ProcessUserRegForm);
// made registration validation for when new users are created

router.get('/login', showLogin);
router.post('/login', userValidation, processLogin);
// made a SEPARATE validation layer DUE to the fact that user validation has LESS values
router.get('/logout', processLogout);

router.get('/dashboard', requireCred, showDashboard);
router.get('/user_management', requirePerm('admin'), showMngemntDashboard);


//router.get('',);
//router.post('',);


router.get('/test-error',servError);

export default router;