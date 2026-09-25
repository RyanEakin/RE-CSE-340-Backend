import { getAllCategories, getCategoriesByProjectId, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

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

export {categoryPage, showCatDetailsPage};