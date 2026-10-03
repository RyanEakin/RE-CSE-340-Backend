import { body, validationResult } from 'express-validator';

import { createCategory, getAllCategories, getCategoriesByProjectId, getCategoryById, getProjectsByCategoryId, editCategory, updateCategoryAssignments } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

const categoryPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Categories';

    res.render('categories', { title, categories });
};

const showCatDetailsPage = async (req,res) => {
  const categoryId = req.params.id
  const catDetails = await getCategoryById(categoryId);
  const projDetails = await getProjectsByCategoryId(categoryId);
  
  //console.log(catDetails.category_name); 
  //used to verify that code was being properly called, model had a missing ' , ' between category_id and category_name.

  const title = catDetails.category_name;

  res.render('cat_details', {title, catDetails, projDetails});
};

const showAssignCatForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('cat_assign', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCatForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const showNewCatForm = async (req, res) => {
    const catDetails = await getAllCategories();
    const title = 'Add New Categories';

    res.render('new_categories', { title, catDetails });
}

const processNewCatForm = async (req, res) => {
    // Extract form data from req.body
    const { categoryName} = req.body;

        // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new_categories');
    }

    try {
        // Create the new project in the database
        const newCategoryId = await createCategory(categoryName);

        req.flash('success', 'New category created successfully!');
        res.redirect(`/new_categories/`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the category.');
        res.redirect('/new_categories');
    }
}

const showEditCatForm = async (req,res) => {
    const categoryId = req.params.id;
    const catDetails = await getCategoryById(categoryId);

    const title = 'Edit category';
    res.render('cat_edit', {title, catDetails});
};

const processEditCatForm = async (req,res) => {
    const Id = req.params.id;
    const { categoryName } = req.body;
    // always remember to name the variables TO the names within the BODY of the html
    
    // testing for the category_id and category_name and if it ACTUALLY gets collected or not
    //console.log("Request body:", req.body);

    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect(`/edit_categories`);
    }

    await editCategory(Id, categoryName);
    req.flash('success', 'Category Edited successfully!');
    res.redirect(`/category/${Id}`);
};

const categoryValidation = [
    body('Id')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('categoryName')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
];

export {categoryPage, getCategoriesByProjectId, showCatDetailsPage, showAssignCatForm, processAssignCatForm, showNewCatForm, processNewCatForm, showEditCatForm, processEditCatForm};