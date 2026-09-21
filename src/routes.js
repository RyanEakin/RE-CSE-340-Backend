import express from 'express';

import { indexPage } from '../src/controllers/index.js';
import { orgPage } from '../src/controllers/organizations.js';
import { categoryPage } from '../src/controllers/categories.js';
import { projectPage } from '../src/controllers/projects.js';
import { servError } from '../src/controllers/errors.js';

const router = express.Router();

/**
 * Routes
 */

router.get('/', indexPage);
router.get('/organizations', orgPage);
router.get('/projects', projectPage);
router.get('/categories',categoryPage);

router.get('/test-error',servError);

export default router;