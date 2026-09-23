import express from 'express';

import { indexPage } from '../src/controllers/index.js';

import { orgPage, showOrgDetailsPage } from '../src/controllers/organizations.js';
import { projectPage, showProjDetailsPage } from '../src/controllers/projects.js';

import { categoryPage } from '../src/controllers/categories.js';

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

router.get('/test-error',servError);

export default router;