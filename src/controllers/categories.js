import { getAllCategories, getCategoriesByProjectId, getCategoryById, getProjectsByCategoryId, updateCategoryAssignments } from '../models/categories.js';
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

export {categoryPage, getCategoriesByProjectId, showCatDetailsPage, showAssignCatForm, processAssignCatForm};